using System.Security.Claims;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APITEST.Contracts.Auth;
//using APITEST;
using APITEST.Models;
using APITEST.Services.Auth;

namespace APITEST.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly TareasContext _dbContext;
    private readonly IGoogleTokenValidator _googleTokenValidator;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(
        TareasContext dbContext,
        IGoogleTokenValidator googleTokenValidator,
        IJwtTokenService jwtTokenService)
    {
        _dbContext = dbContext;
        _googleTokenValidator = googleTokenValidator;
        _jwtTokenService = jwtTokenService;
    }

    [AllowAnonymous]
    [HttpPost("google")]
    public async Task<ActionResult<LoginResponse>> GoogleLogin(
        [FromBody] GoogleLoginRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.IdToken))
        {
            return BadRequest(new { message = "El idToken es obligatorio." });
        }

        GoogleJsonWebSignature.Payload payload;

        try
        {
            payload = await _googleTokenValidator.ValidateAsync(request.IdToken);
        }
        catch (InvalidJwtException)
        {
            return Unauthorized(new { message = "El ID token de Google es inválido." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error validando token de Google.", detail = ex.Message });
        }

        if (string.IsNullOrWhiteSpace(payload.Subject))
        {
            return Unauthorized(new { message = "El token no contiene el claim sub." });
        }

        var now = DateTime.UtcNow;

        var user = await _dbContext.Users
            .SingleOrDefaultAsync(x => x.GoogleSub == payload.Subject, cancellationToken);

        if (user is null)
        {
            user = new AppUser
            {
                GoogleSub = payload.Subject,
                Email = payload.Email ?? string.Empty,
                EmailVerified = payload.EmailVerified,
                FullName = payload.Name,
                GivenName = payload.GivenName,
                FamilyName = payload.FamilyName,
                PictureUrl = payload.Picture,
                Locale = payload.Locale,
                Role = "User",
                CreatedAtUtc = now,
                LastLoginAtUtc = now
            };

            _dbContext.Users.Add(user);
        }
        else
        {
            user.Email = payload.Email ?? user.Email;
            user.EmailVerified = payload.EmailVerified;
            user.FullName = payload.Name ?? user.FullName;
            user.GivenName = payload.GivenName ?? user.GivenName;
            user.FamilyName = payload.FamilyName ?? user.FamilyName;
            user.PictureUrl = payload.Picture ?? user.PictureUrl;
            user.Locale = payload.Locale ?? user.Locale;
            user.LastLoginAtUtc = now;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        var (token, expiresAtUtc) = _jwtTokenService.CreateToken(user);

        return Ok(new LoginResponse
        {
            AccessToken = token,
            ExpiresAtUtc = expiresAtUtc,
            User = new AuthUserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.FullName,
                Role = user.Role,
                PictureUrl = user.PictureUrl
            }
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == userId, cancellationToken);

        if (user is null)
        {
            return NotFound();
        }

        return Ok(new
        {
            user.Id,
            user.Email,
            Name = user.FullName,
            user.Role,
            user.PictureUrl
        });
    }
}