using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using APITEST.Models;

namespace APITEST.Services.Auth;

public sealed class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public (string token, DateTime expiresAtUtc) CreateToken(AppUser user)
    {
        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("Falta Jwt:Issuer.");

        var audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("Falta Jwt:Audience.");

        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Falta Jwt:Key.");

        if (key.Length < 32)
            throw new InvalidOperationException("Jwt:Key debe tener al menos 32 caracteres.");

        var accessTokenMinutes = int.TryParse(_configuration["Jwt:AccessTokenMinutes"], out var minutes)
            ? minutes
            : 60;

        var now = DateTime.UtcNow;
        var expiresAtUtc = now.AddMinutes(accessTokenMinutes);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName ?? user.Email),
            new(ClaimTypes.Role, user.Role),
            new("google_sub", user.GoogleSub)
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: now,
            expires: expiresAtUtc,
            signingCredentials: credentials
        );

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);

        return (token, expiresAtUtc);
    }
}