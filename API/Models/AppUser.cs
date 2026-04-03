namespace APITEST.Models;

public sealed class AppUser
{
    public int Id { get; set; }

    // Identificador estable de Google. Use este como clave externa lógica.
    public string GoogleSub { get; set; } = null!;

    public string Email { get; set; } = null!;
    public bool EmailVerified { get; set; }

    public string? FullName { get; set; }
    public string? GivenName { get; set; }
    public string? FamilyName { get; set; }
    public string? PictureUrl { get; set; }
    public string? Locale { get; set; }

    public string Role { get; set; } = "User";

    public DateTime CreatedAtUtc { get; set; }
    public DateTime LastLoginAtUtc { get; set; }
}