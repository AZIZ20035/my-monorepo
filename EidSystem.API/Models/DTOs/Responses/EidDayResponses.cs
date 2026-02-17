namespace EidSystem.API.Models.DTOs.Responses;

public class EidDayResponse
{
    public int EidDayId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public DateTime Date { get; set; }
    public int DayNumber { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public List<GroupedEidDayPeriodResponse> Periods { get; set; } = new();
}

public class DayPeriodCategoryResponse
{
    public int DayPeriodCategoryId { get; set; }
    public int CategoryId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public int ProductCount { get; set; }
}

public class DayPeriodResponse
{
    public int PeriodId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int DefaultCapacity { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public List<DayPeriodCategoryResponse> Categories { get; set; } = new();
}

public class EidDayPeriodResponse
{
    public int EidDayPeriodId { get; set; }
    public int EidDayId { get; set; }
    public string EidDayName { get; set; } = string.Empty;
    public DateTime EidDayDate { get; set; }
    public int DayPeriodCategoryId { get; set; }
    public int PeriodId { get; set; }
    public string PeriodName { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int MaxCapacity { get; set; }
    public int CurrentOrders { get; set; }
    public int AvailableAmount { get; set; }
    public bool IsActive { get; set; }
    public bool IsFull { get; set; }
}

public class GroupedEidDayPeriodResponse
{
    public int PeriodId { get; set; }
    public string PeriodName { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public List<CategoryCapacityResponse> CategoryCapacities { get; set; } = new();
}

public class CategoryCapacityResponse
{
    public int EidDayPeriodId { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int MaxCapacity { get; set; }
    public int CurrentOrders { get; set; }
    public int AvailableAmount { get; set; }
    public bool IsFull { get; set; }
}

public class PeriodAvailabilityResponse
{
    public int EidDayPeriodId { get; set; }
    public string DayName { get; set; } = string.Empty;
    public string PeriodName { get; set; } = string.Empty;
    public int Available { get; set; }
    public int Total { get; set; }
    public bool IsFull { get; set; }
}
