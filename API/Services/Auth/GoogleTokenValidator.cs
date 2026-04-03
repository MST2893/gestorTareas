using Google.Apis.Auth;

namespace APITEST.Services.Auth;

public sealed class GoogleTokenValidator : IGoogleTokenValidator
{
    private readonly IConfiguration _configuration;

    public GoogleTokenValidator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<GoogleJsonWebSignature.Payload> ValidateAsync(string idToken)
    {
        if (string.IsNullOrWhiteSpace(idToken))
            throw new ArgumentException("El ID token de Google es obligatorio.", nameof(idToken));

        var clientId = _configuration["Authentication:Google:ClientId"];
        if (string.IsNullOrWhiteSpace(clientId))
            throw new InvalidOperationException("Falta Authentication:Google:ClientId en configuración.");

        var hostedDomain = _configuration["Authentication:Google:HostedDomain"];

        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { clientId }
        };

        // Opcional: restricción a un dominio de Google Workspace.
        if (!string.IsNullOrWhiteSpace(hostedDomain))
        {
            settings.HostedDomain = hostedDomain;
        }

        return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
    }
}