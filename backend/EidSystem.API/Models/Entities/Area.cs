namespace EidSystem.API.Models.Entities;

public class Area
{
    public int AreaId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public decimal DeliveryCost { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    // Navigation
    public virtual ICollection<CustomerAddress> CustomerAddresses { get; set; } = new List<CustomerAddress>();
}
