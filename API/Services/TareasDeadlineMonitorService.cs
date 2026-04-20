using Microsoft.EntityFrameworkCore;

namespace APITEST.Services;

public sealed class TareasDeadlineMonitorService : BackgroundService
{

    private const int EstadoCompletada = 2;
    private const int EstadoCancelada = 3;
    private const int EstadoCaducada = 4;

    private static readonly TimeSpan DefaultDeadlineCheckInterval = TimeSpan.FromSeconds(1);
    private static readonly TimeSpan DefaultSqlRefreshInterval = TimeSpan.FromSeconds(5);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<TareasDeadlineMonitorService> _logger;
    private readonly TimeSpan _deadlineCheckInterval;
    private readonly TimeSpan _sqlRefreshInterval;

    public TareasDeadlineMonitorService(
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration,
        ILogger<TareasDeadlineMonitorService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;

        _deadlineCheckInterval = GetConfiguredInterval(
            configuration,
            "TareasDeadlineMonitor:CheckIntervalSeconds",
            DefaultDeadlineCheckInterval);

        _sqlRefreshInterval = GetConfiguredInterval(
            configuration,
            "TareasDeadlineMonitor:SqlRefreshSeconds",
            DefaultSqlRefreshInterval);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var deadlinesEnMemoria = new Dictionary<Guid, DateTime>();
        var proximaConsultaSql = DateTime.MinValue;

        using var timer = new PeriodicTimer(_deadlineCheckInterval);

        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var ahora = DateTime.Now;

                // SQL se consulta cada pocos segundos, no en cada tick.
                // Primero caducamos cualquier tarea que ya este vencida y despues
                // traemos a memoria solo las que pueden vencer antes del proximo refresco.
                if (ahora >= proximaConsultaSql)
                {
                    await CaducarTareasVencidasEnSqlAsync(ahora, stoppingToken);
                    deadlinesEnMemoria = await CargarDeadlinesProximosAsync(ahora, stoppingToken);
                    proximaConsultaSql = ahora.Add(_sqlRefreshInterval);
                }

                // Este chequeo si corre segundo a segundo, pero compara contra datos
                // ya cargados en memoria para evitar pegarle a SQL todo el tiempo.
                await CaducarDeadlinesEnMemoriaAsync(deadlinesEnMemoria, ahora, stoppingToken);

                await timer.WaitForNextTickAsync(stoppingToken);
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
        }
    }

    private async Task<Dictionary<Guid, DateTime>> CargarDeadlinesProximosAsync(
        DateTime ahora,
        CancellationToken cancellationToken)
    {
        try
        {
            var hasta = ahora.Add(_sqlRefreshInterval).Add(_deadlineCheckInterval);

            await using var scope = _scopeFactory.CreateAsyncScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TareasContext>();

            var deadlines = await dbContext.Tareas
                .AsNoTracking()
                .Where(t =>
                    t.Deadline > DateTime.MinValue &&
                    t.Deadline > ahora &&
                    t.Deadline <= hasta &&
                    t.Estado != EstadoCompletada &&
                    t.Estado != EstadoCancelada &&
                    t.Estado != EstadoCaducada)
                .Select(t => new TareaDeadlinePendiente(t.TareaId, t.Deadline))
                .ToListAsync(cancellationToken);

            return deadlines.ToDictionary(t => t.TareaId, t => t.Deadline);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            return new Dictionary<Guid, DateTime>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al cargar deadlines proximos.");
            return new Dictionary<Guid, DateTime>();
        }
    }

    private async Task CaducarDeadlinesEnMemoriaAsync(
        Dictionary<Guid, DateTime> deadlinesEnMemoria,
        DateTime ahora,
        CancellationToken cancellationToken)
    {
        var tareasVencidas = deadlinesEnMemoria
            .Where(t => t.Value <= ahora)
            .Select(t => t.Key)
            .ToArray();

        if (tareasVencidas.Length == 0)
        {
            return;
        }

        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TareasContext>();

            var tareasActualizadas = await dbContext.Tareas
                .Where(t =>
                    tareasVencidas.Contains(t.TareaId) &&
                    t.Estado != EstadoCompletada &&
                    t.Estado != EstadoCancelada &&
                    t.Estado != EstadoCaducada)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(t => t.Estado, EstadoCaducada),
                    cancellationToken);

            foreach (var tareaId in tareasVencidas)
            {
                deadlinesEnMemoria.Remove(tareaId);
            }

            RegistrarTareasActualizadas(tareasActualizadas);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al caducar deadlines cargados en memoria.");
        }
    }

    private async Task CaducarTareasVencidasEnSqlAsync(DateTime ahora, CancellationToken cancellationToken)
    {
        try
        {
            await using var scope = _scopeFactory.CreateAsyncScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TareasContext>();

            // Este UPDATE cubre las tareas que ya estaban vencidas al arrancar la API
            // o las que fueron creadas/modificadas entre dos refrescos de SQL.
            var tareasActualizadas = await dbContext.Tareas
                .Where(t =>
                    t.Deadline > DateTime.MinValue &&
                    t.Deadline <= ahora &&
                    t.Estado != EstadoCompletada &&
                    t.Estado != EstadoCancelada &&
                    t.Estado != EstadoCaducada)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(t => t.Estado, EstadoCaducada),
                    cancellationToken);

            RegistrarTareasActualizadas(tareasActualizadas);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar tareas vencidas.");
        }
    }

    private void RegistrarTareasActualizadas(int tareasActualizadas)
    {
        if (tareasActualizadas > 0)
        {
            _logger.LogInformation(
                "Se marcaron {CantidadTareas} tarea(s) como caducadas.",
                tareasActualizadas);
        }
    }

    private static TimeSpan GetConfiguredInterval(
        IConfiguration configuration,
        string key,
        TimeSpan defaultValue)
    {
        var seconds = configuration.GetValue<int?>(key) ?? (int)defaultValue.TotalSeconds;

        return TimeSpan.FromSeconds(Math.Max(1, seconds));
    }

    private sealed record TareaDeadlinePendiente(Guid TareaId, DateTime Deadline);
}
