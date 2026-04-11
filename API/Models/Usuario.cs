using System.Text.Json.Serialization;

namespace APITEST.Models;

public class Usuario
{
    public Usuario()
    {
        TareaUsuariosR = new List<TareaUsuariosRel>();
    }

    public Guid UsuarioId {get;set;}
    public string? GoogleSub {get;set;}
    public string? Nombre {get;set;}
    public string? Email {get;set;}
    public int Permisos {get;set;}

    public string? FotoPerfil {get;set;}

    [JsonIgnore]
    public virtual ICollection<TareaUsuariosRel> TareaUsuariosR {get;set;}
}