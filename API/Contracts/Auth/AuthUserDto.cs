namespace APITEST.Contracts.Auth;

public sealed class AuthUserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string Role { get; set; } = "User";
    public string? PictureUrl { get; set; }
}