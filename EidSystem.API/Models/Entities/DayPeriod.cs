namespace EidSystem.API.Models.Entities;

public class DayPeriod
{
    public int PeriodId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int DefaultCapacity { get; set; } = 12;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    // Navigation
    public virtual ICollection<DayPeriodCategory> DayPeriodCategories { get; set; } = new List<DayPeriodCategory>();
}
