using EidSystem.API.Models.DTOs.Responses;

namespace EidSystem.API.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsResponse> GetStatsAsync();
    Task<IEnumerable<PeriodAvailabilityResponse>> GetPeriodAvailabilityAsync();
}
