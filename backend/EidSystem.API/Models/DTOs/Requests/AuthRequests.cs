namespace EidSystem.API.Models.DTOs.Requests;

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class CreateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "call_center";
}

public class UpdateUserRequest
{
    public string? FullName { get; set; }
    public string? Role { get; set; }
    public bool? IsActive { get; set; }
}
