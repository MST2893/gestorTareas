using APITEST.Models;

namespace APITEST.Services.Auth;

public interface IJwtTokenService
{
    (string token, DateTime expiresAtUtc) CreateToken(AppUser user);
}