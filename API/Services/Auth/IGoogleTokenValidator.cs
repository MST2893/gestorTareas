using Google.Apis.Auth;

namespace APITEST.Services.Auth;

public interface IGoogleTokenValidator
{
    Task<GoogleJsonWebSignature.Payload> ValidateAsync(string idToken);
}