namespace EidSystem.API.Models.Entities;

public class DayPeriodCategory
{
    public int DayPeriodCategoryId { get; set; }
    public int PeriodId { get; set; }
    public int CategoryId { get; set; }

    // Navigation
    public virtual DayPeriod Period { get; set; } = null!;
    public virtual Category Category { get; set; } = null!;
    public virtual ICollection<EidDayPeriod> EidDayPeriods { get; set; } = new List<EidDayPeriod>();
}
