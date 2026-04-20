using Microsoft.EntityFrameworkCore;
using APITEST.Models;

namespace APITEST;

public class TareasContext: DbContext
{
    public DbSet<Categoria> Categorias {get;set;}
    public DbSet<Tarea> Tareas {get;set;}
    public DbSet<Usuario> Usuarios {get;set;}
    public DbSet<TareaUsuariosRel> TareaUsuariosRels {get;set;}
    public DbSet<AppUser> Users {get;set;}

    public TareasContext(DbContextOptions<TareasContext> options) :base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        List<Categoria> categoriasInit = new List<Categoria>();
        categoriasInit.Add(new Categoria() { CategoriaId = Guid.Parse("fe2de405-c38e-4c90-ac52-da0540dfb4ef"), Nombre = "Actividades pendientes", Peso = 20});
        categoriasInit.Add(new Categoria() { CategoriaId = Guid.Parse("fe2de405-c38e-4c90-ac52-da0540dfb402"), Nombre = "Actividades personales", Peso = 50});

        modelBuilder.Entity<Categoria>(categoria=> 
        {
            categoria.ToTable("Categoria");
            categoria.HasKey(p=> p.CategoriaId);

            categoria.Property(p=> p.Nombre).IsRequired().HasMaxLength(150);

            categoria.Property(p=> p.Descripcion).IsRequired(false);

            categoria.Property(p=> p.Peso);

            categoria.HasData(categoriasInit);
        });

        List<Tarea> tareasInit = new List<Tarea>();

        DateTime Fecha = new DateTime(2026, 4, 9, 0, 0, 0, DateTimeKind.Local);

        tareasInit.Add(new Tarea() { TareaId = Guid.Parse("fe2de405-c38e-4c90-ac52-da0540dfb410"), CategoriaId = Guid.Parse("fe2de405-c38e-4c90-ac52-da0540dfb4ef"), PrioridadTarea = Prioridad.Media, Titulo = "Pago de servicios publicos", FechaCreacion = Fecha });
        tareasInit.Add(new Tarea() { TareaId = Guid.Parse("fe2de405-c38e-4c90-ac52-da0540dfb411"), CategoriaId = Guid.Parse("fe2de405-c38e-4c90-ac52-da0540dfb402"), PrioridadTarea = Prioridad.Baja, Titulo = "Terminar de ver pelicula en netflix", FechaCreacion = Fecha });
        
        modelBuilder.Entity<Tarea>(tarea=>
        {
            tarea.ToTable("Tarea");
            tarea.HasKey(p=> p.TareaId);

            tarea.HasOne(p=> p.Categoria).WithMany(p=> p.Tareas).HasForeignKey(p=> p.CategoriaId);

            tarea.HasIndex(p=> new { p.Deadline, p.Estado }).HasDatabaseName("IX_Tarea_Deadline_Estado");

            tarea.Property(p=> p.Titulo).IsRequired().HasMaxLength(200);

            tarea.Property(p=> p.Descripcion).IsRequired(false);

            tarea.Property(p=> p.PrioridadTarea);

            tarea.Property(p=> p.FechaCreacion);

            tarea.Property(p=> p.FechaCompletada);

            tarea.Property(p=> p.Deadline);

            tarea.Property(p=> p.Estado);

            tarea.Ignore(p=> p.Resumen);

            tarea.HasData(tareasInit);

        });


        List<Usuario> usuariosInit = new List<Usuario>();


        modelBuilder.Entity<Usuario>(usuario=>
        {
            usuario.ToTable("Usuario");
            usuario.HasKey(p=> p.UsuarioId);

            usuario.Property(p=> p.GoogleSub).IsRequired();

            usuario.Property(p=> p.Nombre).IsRequired();

            usuario.Property(p=> p.Email).IsRequired();

            usuario.Property(p=> p.Permisos).IsRequired();

            usuario.Property(p=> p.FotoPerfil).IsRequired();
        });


        List<TareaUsuariosRel> tareaUsuariosInit = new List<TareaUsuariosRel>();

        tareaUsuariosInit.Add(new TareaUsuariosRel()
        {
            TareaId = Guid.Parse("fe2de405-c38e-4c90-ac52-da0540dfb410"), // tarea 1
            UsuarioId = Guid.Parse("557c32cb-aefb-4fe9-a402-48e3de0828eb") // Matías
        });

        tareaUsuariosInit.Add(new TareaUsuariosRel()
        {
            TareaId = Guid.Parse("fe2de405-c38e-4c90-ac52-da0540dfb410"), // tarea 1
            UsuarioId = Guid.Parse("01c8921f-5b16-4895-abb4-4436fa7338b5") // Juan
        });

        modelBuilder.Entity<TareaUsuariosRel>(tareaUsuario=>
        {
            tareaUsuario.ToTable("TareaUsuariosRel");
            tareaUsuario.HasKey(p=> new { p.TareaId, p.UsuarioId });

            tareaUsuario.HasOne(p=> p.Tarea).WithMany(p=> p.TareaUsuariosR).HasForeignKey(p=> p.TareaId);
            tareaUsuario.HasOne(p=> p.Usuario).WithMany(p=> p.TareaUsuariosR).HasForeignKey(p=> p.UsuarioId);

            tareaUsuario.HasData(tareaUsuariosInit);
        });

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.GoogleSub).IsUnique();

            entity.Property(x => x.GoogleSub)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(x => x.Email)
                .HasMaxLength(320)
                .IsRequired();

            entity.Property(x => x.FullName)
                .HasMaxLength(200);

            entity.Property(x => x.GivenName)
                .HasMaxLength(100);

            entity.Property(x => x.FamilyName)
                .HasMaxLength(100);

            entity.Property(x => x.PictureUrl)
                .HasMaxLength(1000);

            entity.Property(x => x.Locale)
                .HasMaxLength(20);

            entity.Property(x => x.Role)
                .HasMaxLength(50)
                .IsRequired();
        });


    }

}
