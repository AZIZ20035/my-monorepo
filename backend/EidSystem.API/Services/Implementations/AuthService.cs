using EidSystem.API.Exceptions;
using EidSystem.API.Helpers;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Repositories.Interfaces;
using EidSystem.API.Services.Interfaces;

namespace EidSystem.API.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtHelper _jwtHelper;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtHelper jwtHelper)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtHelper = jwtHelper;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByUsernameAsync(request.Username);
        
        if (user == null || !user.IsActive)
            throw new UnauthorizedException("اسم المستخدم أو كلمة المرور غير صحيحة");

        if (!_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            throw new UnauthorizedException("اسم المستخدم أو كلمة المرور غير صحيحة");

        var token = _jwtHelper.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            User = new UserResponse
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            },
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };
    }

    public async Task<UserResponse> GetCurrentUserAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
            throw new NotFoundException("User", userId);

        return new UserResponse
        {
            UserId = user.UserId,
            Username = user.Username,
            FullName = user.FullName,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task ChangePasswordAsync(int userId, ChangePasswordRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
            throw new NotFoundException("User", userId);

        if (!_passwordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
            throw new BusinessException("كلمة المرور الحالية غير صحيحة");

        user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
    }
}
