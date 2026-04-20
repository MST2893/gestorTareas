using Microsoft.EntityFrameworkCore;

namespace APITEST.Services;

public sealed class TareasDeadlineMonitorService : BackgroundService
{
    private const int EstadoCompletada = 2;
    private const int EstadoCancelada = 3;
    private const int EstadoCaducada = 4;
    private static readonly TimeSpan DefaultInterval = TimeSpan.FromMinutes(30);

    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<TareasDeadlineMonitorService> _logger;
    private readonly TimeSpan _interval;

    public TareasDeadlineMonitorService(
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration,
        ILogger<TareasDeadlineMonitorService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;

        var intervalMinutes = configuration.GetValue<int?>("TareasDeadlineMonitor:IntervalMinutes")
            ?? (int)DefaultInterval.TotalMinutes;

        _interval = TimeSpan.FromMinutes(Math.Max(1, intervalMinutes));
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await ActualizarTareasVencidasAsync(stoppingToken);

        using var timer = new PeriodicTimer(_interval);

        try
        {
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await ActualizarTareasVencidasAsync(stoppingToken);
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
        }
    }

    private async Task ActualizarTareasVencidasAsync(CancellationToken cancellationToken)
    {
        try
        {
            var inicioDeManana = DateTime.Today.AddDays(1);

            await using var scope = _scopeFactory.CreateAsyncScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TareasContext>();

            var tareasActualizadas = await dbContext.Tareas
                .Where(t =>
                    t.Deadline > DateTime.MinValue &&
                    t.Deadline < inicioDeManana &&
                    t.Estado != EstadoCompletada &&
                    t.Estado != EstadoCancelada &&
                    t.Estado != EstadoCaducada)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(t => t.Estado, EstadoCaducada),
                    cancellationToken);

            if (tareasActualizadas > 0)
            {
                _logger.LogInformation(
                    "Se marcaron {CantidadTareas} tarea(s) como caducadas.",
                    tareasActualizadas);
            }
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar tareas vencidas.");
        }
    }
}
