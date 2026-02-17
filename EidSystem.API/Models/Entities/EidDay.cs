namespace EidSystem.API.Models.Entities;

public class EidDay
{
    public int EidDayId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public DateTime Date { get; set; }
    public int DayNumber { get; set; } // 0 = وقفة، 1 = أول أيام العيد
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    // Navigation
    public virtual ICollection<EidDayPeriod> EidDayPeriods { get; set; } = new List<EidDayPeriod>();
}
