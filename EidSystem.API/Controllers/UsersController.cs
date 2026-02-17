using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EidSystem.API.Controllers;

[Authorize(Roles = "admin")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserResponse>>>> GetAll()
    {
        var result = await _userService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<UserResponse>>.SuccessResponse(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetById(int id)
    {
        var result = await _userService.GetByIdAsync(id);
        return Ok(ApiResponse<UserResponse>.SuccessResponse(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserResponse>>> Create([FromBody] CreateUserRequest request)
    {
        var result = await _userService.CreateAsync(request);
        return Ok(ApiResponse<UserResponse>.SuccessResponse(result, "تم إنشاء المستخدم بنجاح"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> Update(int id, [FromBody] UpdateUserRequest request)
    {
        var result = await _userService.UpdateAsync(id, request);
        return Ok(ApiResponse<UserResponse>.SuccessResponse(result, "تم تحديث المستخدم بنجاح"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await _userService.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم حذف المستخدم بنجاح"));
    }

    [HttpPost("{id}/reset-password")]
    public async Task<ActionResult<ApiResponse<object>>> ResetPassword(int id, [FromBody] string newPassword)
    {
        await _userService.ResetPasswordAsync(id, newPassword);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم إعادة تعيين كلمة المرور بنجاح"));
    }
}
