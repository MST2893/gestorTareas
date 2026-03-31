using System.Text.Json.Serialization;

namespace APITEST.Models;

public class Usuario
{
    public Guid UsuarioId {get;set;}
    public string Nombre {get;set;}
    public string Email {get;set;}

    [JsonIgnore]
    public virtual ICollection<TareaUsuariosRel> TareaUsuariosR {get;set;}
}