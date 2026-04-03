namespace APITEST.Contracts.Auth;

public sealed class GoogleLoginRequest
{
    public string IdToken { get; set; } = string.Empty;
}