using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using System.Text.Json.Serialization;

namespace APITEST.Models;

public class Tarea
{
    public Tarea()
    {
        TareaUsuariosR = new List<TareaUsuariosRel>();
    }

    //[Key]
    public Guid TareaId {get;set;}
    
    //[ForeignKey("CategoriaId")]
    public Guid CategoriaId {get;set;}

    //[Required]
    //[MaxLength(200)]
    public string? Titulo {get;set;}

    public string? Descripcion {get;set;}

    public Prioridad PrioridadTarea {get;set;}

    public DateTime FechaCreacion {get;set;}
    
    public virtual Categoria? Categoria {get;set;}

    public DateTime Deadline {get;set;}
    public DateTime FechaCompletada {get;set;}

    public int Estado {get;set;} //(0: Pendiente, 1: Haciendo, 3: Completada, 4: Cancelada)

    //[NotMapped]
    [JsonIgnore]
    public string? Resumen {get;set;}

    public virtual ICollection<TareaUsuariosRel> TareaUsuariosR {get;set;}
}

public enum Prioridad
{
    Baja,
    Media,
    Alta
}