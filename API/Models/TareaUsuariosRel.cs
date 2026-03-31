using System.Text.Json.Serialization;

namespace APITEST.Models;

public class TareaUsuariosRel
{
    public Guid TareaId {get;set;}
    public Guid UsuarioId {get;set;}

    [JsonIgnore]
    public virtual Tarea Tarea {get;set;}

    [JsonIgnore]
    public virtual Usuario Usuario {get;set;}
}