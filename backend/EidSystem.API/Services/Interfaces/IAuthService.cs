using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;

namespace EidSystem.API.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<UserResponse> GetCurrentUserAsync(int userId);
    Task ChangePasswordAsync(int userId, ChangePasswordRequest request);
}
