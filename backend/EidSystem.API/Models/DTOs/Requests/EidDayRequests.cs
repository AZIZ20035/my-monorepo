namespace EidSystem.API.Models.DTOs.Requests;

public class CreateEidDayRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public DateTime Date { get; set; }
    public int DayNumber { get; set; }
    public int SortOrder { get; set; } = 0;
}

public class UpdateEidDayRequest
{
    public string? NameAr { get; set; }
    public string? NameEn { get; set; }
    public DateTime? Date { get; set; }
    public int? DayNumber { get; set; }
    public bool? IsActive { get; set; }
    public int? SortOrder { get; set; }
}

public class CreateDayPeriodRequest
{
    public int? CategoryId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int DefaultCapacity { get; set; } = 12;
    public int SortOrder { get; set; } = 0;
}

public class UpdateEidDayPeriodRequest
{
    public int? MaxCapacity { get; set; }
    public bool? IsActive { get; set; }
}

public class CreateDayPeriodWithCategoriesRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int DefaultCapacity { get; set; } = 12;
    public int SortOrder { get; set; } = 0;
    public List<int> CategoryIds { get; set; } = new();
}

public class BulkAssignCategoriesRequest
{
    public List<CategoryAssignmentItem> Assignments { get; set; } = new();
}

public class CategoryAssignmentItem
{
    public int DayPeriodCategoryId { get; set; }
    public int MaxCapacity { get; set; }
}
