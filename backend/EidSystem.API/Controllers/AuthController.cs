using System.Security.Claims;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EidSystem.API.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        
        // Set HTTP-only cookie with JWT token
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,  // CRITICAL: JavaScript cannot access - keeps token secure
            Secure = Request.IsHttps,  // Auto: true for HTTPS, false for HTTP
            SameSite = SameSiteMode.Lax,  // Better compatibility while still secure
            Expires = result.ExpiresAt,
            Path = "/"
        };
        
        Response.Cookies.Append("auth_token", result.Token, cookieOptions);
        
        // Return user data only - NO TOKEN in response
        var response = new LoginResponse
        {
            User = result.User
            // Token and ExpiresAt intentionally excluded
        };
        
        return Ok(ApiResponse<LoginResponse>.SuccessResponse(response, "تم تسجيل الدخول بنجاح"));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetCurrentUser()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var result = await _authService.GetCurrentUserAsync(userId);
        return Ok(ApiResponse<UserResponse>.SuccessResponse(result));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        await _authService.ChangePasswordAsync(userId, request);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم تغيير كلمة المرور بنجاح"));
    }

    [Authorize]
    [HttpPost("logout")]
    public ActionResult<ApiResponse<object>> Logout()
    {

        // Clear the authentication cookie
        Response.Cookies.Delete("auth_token");

        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم تسجيل الخروج بنجاح"));
    }
}
