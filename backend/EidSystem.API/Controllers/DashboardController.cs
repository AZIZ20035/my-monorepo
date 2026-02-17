using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EidSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<DashboardStatsResponse>>> GetStats()
    {
        var result = await _dashboardService.GetStatsAsync();
        return Ok(ApiResponse<DashboardStatsResponse>.SuccessResponse(result));
    }

    [HttpGet("period-availability")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PeriodAvailabilityResponse>>>> GetPeriodAvailability()
    {
        var result = await _dashboardService.GetPeriodAvailabilityAsync();
        return Ok(ApiResponse<IEnumerable<PeriodAvailabilityResponse>>.SuccessResponse(result));
    }
}
