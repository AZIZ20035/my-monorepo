namespace EidSystem.API.Models.Entities;

public class CustomerAddress
{
    public int AddressId { get; set; }
    public int CustomerId { get; set; }
    public int AreaId { get; set; }
    public string AddressDetails { get; set; } = string.Empty;
    public string? Label { get; set; } // البيت، الشغل
    public bool IsDefault { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public virtual Customer Customer { get; set; } = null!;
    public virtual Area Area { get; set; } = null!;
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
