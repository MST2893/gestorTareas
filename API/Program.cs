using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APITEST;
using APITEST.Models;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
//using APITEST.Data;
using APITEST.Services;
using APITEST.Services.Auth;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var frontendOrigin = builder.Configuration["Frontend:Origin"]
    ?? throw new InvalidOperationException("Falta Frontend:Origin.");

var allowedFrontendOrigins = new[]
{
    frontendOrigin,
    "https://32ram.com.ar:5500",
    "http://localhost:5500",
    "http://localhost:5501",
    "https://localhost:5500",
    "https://localhost:5501",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:5501",
    "https://127.0.0.1:5500",
    "https://127.0.0.1:5501"
}.Distinct(StringComparer.OrdinalIgnoreCase).ToArray();

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("Frontend", policy =>
//    {
//        policy
//            .WithOrigins(frontendOrigin)
//            .AllowAnyHeader()
//            .AllowAnyMethod();
//    });
//});

builder.Services.AddScoped<IGoogleTokenValidator, GoogleTokenValidator>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddHostedService<TareasDeadlineMonitorService>();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Falta Jwt:Key.");

if (jwtKey.Length < 32)
    throw new InvalidOperationException("Jwt:Key debe tener al menos 32 caracteres.");

var authCookieName = builder.Configuration["Jwt:CookieName"] ?? "gestorTareas_access_token";

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.TryGetValue(authCookieName, out var token))
                {
                    context.Token = token;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();


//builder.Services.AddDbContext<TareasContext>(p => p.UseInMemoryDatabase("TareasDB"));
builder.Services.AddSqlServer<TareasContext>(builder.Configuration.GetConnectionString("cnTareas"));


//Agregado gracias a la IA del frontend
/* builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins(
                "http://32ram.com.ar:5500"
                //"https://misitio.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
}); */


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", cors =>
        cors
            //.AllowAnyOrigin()
            .WithOrigins(allowedFrontendOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
    );
});

var app = builder.Build();


app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

// CORS antes de auth.
//app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


app.MapGet("/", () => "API funcionando correctamente");

app.MapGet("/CargarDatabase", async ([FromServices] TareasContext dbContext) => 
{
    dbContext.Database.EnsureCreated();
    return Results.Ok("¿Se cargó la base de datos?: " + dbContext.Database.CanConnect());

});

app.MapGet("/api/tareas", async ([FromServices] TareasContext dbContext)=>
{
    return Results.Ok(dbContext.Tareas.Include(p=> p.Categoria).ToList());
}).RequireAuthorization();

app.MapGet("/api/categorias", async ([FromServices] TareasContext dbContext) =>
{
    return Results.Ok(dbContext.Categorias.ToList());
}).RequireAuthorization();

app.MapDelete("/api/tareas/{id}", async ([FromServices] TareasContext dbContext, [FromRoute] Guid id) =>
{
     //var tareaActual = dbContext.Tareas.Find(id);

    var tareaActual = await dbContext.Tareas.FirstOrDefaultAsync(t => t.TareaId == id);    

     if(tareaActual!=null)
     {
         dbContext.Remove(tareaActual);
         await dbContext.SaveChangesAsync();

         return Results.Ok();
     }

     return Results.NotFound();
}).RequireAuthorization();

app.MapPost("/api/tareas", async ([FromServices] TareasContext dbContext, [FromBody] Tarea tarea)=>
{
    tarea.TareaId = Guid.NewGuid();
    tarea.FechaCreacion = DateTime.Today;
    await dbContext.AddAsync(tarea);

    await dbContext.SaveChangesAsync();

    return Results.Ok();
}).RequireAuthorization();

app.MapPut("/api/edicion", async ([FromServices] TareasContext dbContext, [FromBody] Tarea tarea)=>
{
    var tareaActual = dbContext.Tareas.Find(tarea.TareaId);

    if(tareaActual!=null)
    {
        tareaActual.CategoriaId = tarea.CategoriaId;
        tareaActual.Titulo = tarea.Titulo;
        tareaActual.PrioridadTarea = tarea.PrioridadTarea;
        tareaActual.Descripcion = tarea.Descripcion;

        await dbContext.SaveChangesAsync();

        return Results.Ok();

    }

    return Results.NotFound();
}).RequireAuthorization();

app.MapPut("/api/edicionestado", async ([FromServices] TareasContext dbContext, [FromBody] Tarea tarea)=>
{
    var tareaActual = dbContext.Tareas.Find(tarea.TareaId);

    if(tareaActual!=null)
    {
        tareaActual.Estado = tarea.Estado;

        await dbContext.SaveChangesAsync();

        return Results.Ok();

    }

    return Results.NotFound();
}).RequireAuthorization();

app.MapGet("/api/tareasyusuario", async ([FromServices] TareasContext dbContext) =>
{
    var tareas = await ConsultaTareasConUsuario(dbContext)
        .ToListAsync();

    return Results.Ok(tareas);
}).RequireAuthorization();

app.MapGet("/api/tareasyusuario/{busqueda}/{orden:int}", async ([FromServices] TareasContext dbContext, [FromRoute] string busqueda, [FromRoute] int orden) =>
{
    var tareas = await AplicarBusquedaYOrden(ConsultaTareasConUsuario(dbContext), busqueda, orden)
        .ToListAsync();

    return Results.Ok(tareas);
}).RequireAuthorization();

app.MapGet("/api/tareasyusuario/{mailGoogle}", async ([FromServices] TareasContext dbContext, [FromRoute] string mailGoogle) =>
{
    var tareas = await ConsultaTareasConUsuario(dbContext)
        .Where(t => t.TareaUsuariosR
            .Any(rel => rel.Usuario != null && rel.Usuario.Email == mailGoogle))
        .ToListAsync();

    return Results.Ok(tareas);
}).RequireAuthorization();

app.MapGet("/api/tareasyusuario/{mailGoogle}/{busqueda}/{orden:int}", async ([FromServices] TareasContext dbContext, [FromRoute] string mailGoogle, [FromRoute] string busqueda, [FromRoute] int orden) =>
{
    var tareas = await AplicarBusquedaYOrden(
            ConsultaTareasConUsuario(dbContext)
                .Where(t => t.TareaUsuariosR
                    .Any(rel => rel.Usuario != null && rel.Usuario.Email == mailGoogle)),
            busqueda,
            orden)
        .ToListAsync();

    return Results.Ok(tareas);
}).RequireAuthorization();

app.MapGet("/api/usuario/{mailGoogle}", async ([FromServices] TareasContext dbContext, [FromRoute] string mailGoogle) =>
{
    var usuario = await dbContext.Usuarios
        .Where(t => t.Email == mailGoogle)
        .FirstOrDefaultAsync();

    return Results.Ok(usuario);
}).RequireAuthorization();

app.MapGet("/api/authCheck", () =>
{
    return Results.Ok(true);
}).RequireAuthorization();

app.Run();

static IQueryable<Tarea> ConsultaTareasConUsuario(TareasContext dbContext)
{
    return dbContext.Tareas
        .Include(t => t.Categoria)
        .Include(t => t.TareaUsuariosR)
            .ThenInclude(rel => rel.Usuario);
}

static IQueryable<Tarea> AplicarBusquedaYOrden(IQueryable<Tarea> query, string? busqueda, int orden)
{
    var textoBusqueda = (busqueda ?? string.Empty).Trim().ToLower();

    if (!string.IsNullOrWhiteSpace(textoBusqueda))
    {
        var prioridades = ObtenerPrioridades(textoBusqueda);
        var estados = ObtenerEstados(textoBusqueda);

        query = (prioridades.Length, estados.Length) switch
        {
            (0, 0) => query.Where(t =>
                t.Titulo != null &&
                t.Titulo.ToLower().Contains(textoBusqueda)),
            (_, 0) => query.Where(t =>
                (t.Titulo != null && t.Titulo.ToLower().Contains(textoBusqueda)) ||
                prioridades.Contains(t.PrioridadTarea)),
            (0, _) => query.Where(t =>
                (t.Titulo != null && t.Titulo.ToLower().Contains(textoBusqueda)) ||
                estados.Contains(t.Estado)),
            _ => query.Where(t =>
                (t.Titulo != null && t.Titulo.ToLower().Contains(textoBusqueda)) ||
                prioridades.Contains(t.PrioridadTarea) ||
                estados.Contains(t.Estado))
        };
    }

    return orden switch
    {
        1 => query
            .OrderByDescending(t => t.PrioridadTarea)
            .ThenBy(t => t.Estado)
            .ThenBy(t => t.Deadline == default ? 1 : 0)
            .ThenBy(t => t.Deadline)
            .ThenByDescending(t => t.FechaCreacion),
        2 => query
            .OrderBy(t => t.Deadline == default ? 1 : 0)
            .ThenBy(t => t.Deadline)
            .ThenBy(t => t.Estado)
            .ThenByDescending(t => t.PrioridadTarea)
            .ThenByDescending(t => t.FechaCreacion),
        _ => query
            .OrderByDescending(t => t.FechaCreacion)
            .ThenByDescending(t => t.PrioridadTarea)
            .ThenBy(t => t.Estado)
            .ThenBy(t => t.Deadline == default ? 1 : 0)
            .ThenBy(t => t.Deadline)
    };
}

static Prioridad[] ObtenerPrioridades(string textoBusqueda)
{
    var prioridades = new List<Prioridad>();

    if (textoBusqueda.Contains("alta"))
    {
        prioridades.Add(Prioridad.Alta);
    }

    if (textoBusqueda.Contains("media"))
    {
        prioridades.Add(Prioridad.Media);
    }

    if (textoBusqueda.Contains("baja"))
    {
        prioridades.Add(Prioridad.Baja);
    }

    return prioridades.ToArray();
}

static int[] ObtenerEstados(string textoBusqueda)
{
    var estados = new List<int>();

    if (textoBusqueda.Contains("pendiente"))
    {
        estados.Add(0);
    }

    if (textoBusqueda.Contains("haciendo"))
    {
        estados.Add(1);
    }

    if (textoBusqueda.Contains("completada"))
    {
        estados.Add(2);
    }
    if (textoBusqueda.Contains("completado"))
    {
        estados.Add(2);
    }

    if (textoBusqueda.Contains("cancelada"))
    {
        estados.Add(3);
    }
    if (textoBusqueda.Contains("cancelado"))
    {
        estados.Add(3);
    }

    if (textoBusqueda.Contains("caducada"))
    {
        estados.Add(4);
    }
    if (textoBusqueda.Contains("caducado"))
    {
        estados.Add(4);
    }

    return estados.ToArray();
}
