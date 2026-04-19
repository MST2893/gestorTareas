namespace APITEST.Contracts.Auth;

public sealed class LoginResponse
{
    public DateTime ExpiresAtUtc { get; set; }
    public AuthUserDto User { get; set; } = new();
}
