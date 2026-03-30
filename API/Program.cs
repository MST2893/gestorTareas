using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APITEST;
using APITEST.Models;

var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddDbContext<TareasContext>(p => p.UseInMemoryDatabase("TareasDB"));
builder.Services.AddSqlServer<TareasContext>(builder.Configuration.GetConnectionString("cnTareas"));


//Agregado gracias a la IA del frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});




var app = builder.Build();


app.UseCors("AllowAll");



app.MapGet("/", () => "Tu vieja en tanga!");

app.MapGet("/CargarDatabase", async ([FromServices] TareasContext dbContext) => 
{
    dbContext.Database.EnsureCreated();
    return Results.Ok("¿Se cargó la base de datos?: " + dbContext.Database.CanConnect());

});

app.MapGet("/api/tareas", async ([FromServices] TareasContext dbContext)=>
{
    return Results.Ok(dbContext.Tareas.Include(p=> p.Categoria).ToList());
});

app.MapGet("/api/categorias", async ([FromServices] TareasContext dbContext) =>
{
    return Results.Ok(dbContext.Categorias.ToList());
});

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
});

app.MapPost("/api/tareas", async ([FromServices] TareasContext dbContext, [FromBody] Tarea tarea)=>
{
    tarea.TareaId = Guid.NewGuid();
    tarea.FechaCreacion = DateTime.Today;
    await dbContext.AddAsync(tarea);

    await dbContext.SaveChangesAsync();

    return Results.Ok();   
});

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
});

app.Run();