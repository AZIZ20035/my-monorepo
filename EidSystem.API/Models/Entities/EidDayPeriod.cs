namespace EidSystem.API.Models.Entities;

public class EidDayPeriod
{
    public int EidDayPeriodId { get; set; }
    public int EidDayId { get; set; }
    public int DayPeriodCategoryId { get; set; }
    public int MaxCapacity { get; set; } = 12;
    public int CurrentOrders { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    // Computed property
    public int AvailableAmount => MaxCapacity - CurrentOrders;

    // Navigation
    public virtual EidDay EidDay { get; set; } = null!;
    public virtual DayPeriodCategory DayPeriodCategory { get; set; } = null!;
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
