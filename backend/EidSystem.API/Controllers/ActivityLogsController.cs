using EidSystem.API.Data;
using EidSystem.API.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Controllers;

[Authorize(Roles = "admin")]
[ApiController]
[Route("api/[controller]")]
public class ActivityLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ActivityLogsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<ActivityLogResponse>>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? entityType = null,
        [FromQuery] int? userId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var query = _context.ActivityLogs
            .Include(l => l.User)
            .AsQueryable();

        if (!string.IsNullOrEmpty(entityType))
            query = query.Where(l => l.EntityType == entityType);
        
        if (userId.HasValue)
            query = query.Where(l => l.UserId == userId.Value);
        
        if (startDate.HasValue)
            query = query.Where(l => l.CreatedAt >= startDate.Value);
        
        if (endDate.HasValue)
            query = query.Where(l => l.CreatedAt <= endDate.Value);

        var totalCount = await query.CountAsync();

        var logs = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new ActivityLogResponse
            {
                LogId = l.LogId,
                UserId = l.UserId,
                UserName = l.User.Username,
                Action = l.Action,
                EntityType = l.EntityType,
                EntityId = l.EntityId,
                IpAddress = l.IpAddress,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();

        var response = new PaginatedResponse<ActivityLogResponse>
        {
            Items = logs,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };

        return Ok(ApiResponse<PaginatedResponse<ActivityLogResponse>>.SuccessResponse(response));
    }

    [HttpGet("entity/{entityType}/{entityId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ActivityLogResponse>>>> GetByEntity(string entityType, int entityId)
    {
        var logs = await _context.ActivityLogs
            .Include(l => l.User)
            .Where(l => l.EntityType == entityType && l.EntityId == entityId)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new ActivityLogResponse
            {
                LogId = l.LogId,
                UserId = l.UserId,
                UserName = l.User.Username,
                Action = l.Action,
                EntityType = l.EntityType,
                EntityId = l.EntityId,
                IpAddress = l.IpAddress,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();

        return Ok(ApiResponse<IEnumerable<ActivityLogResponse>>.SuccessResponse(logs));
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ActivityLogResponse>>>> GetByUser(int userId)
    {
        var logs = await _context.ActivityLogs
            .Include(l => l.User)
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .Take(100)
            .Select(l => new ActivityLogResponse
            {
                LogId = l.LogId,
                UserId = l.UserId,
                UserName = l.User.Username,
                Action = l.Action,
                EntityType = l.EntityType,
                EntityId = l.EntityId,
                IpAddress = l.IpAddress,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();

        return Ok(ApiResponse<IEnumerable<ActivityLogResponse>>.SuccessResponse(logs));
    }
}
