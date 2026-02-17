namespace EidSystem.API.Models.Entities;

public class Customer
{
    public int CustomerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Phone2 { get; set; }
    public string? WhatsappNumber { get; set; }
    public string ServiceStatus { get; set; } = "not_served"; // served, not_served
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public virtual ICollection<CustomerAddress> Addresses { get; set; } = new List<CustomerAddress>();
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual ICollection<WhatsappLog> WhatsappLogs { get; set; } = new List<WhatsappLog>();
}
