namespace EidSystem.API.Models.Entities;

public class ActivityLog
{
    public int LogId { get; set; }
    public int UserId { get; set; }
    public string Action { get; set; } = string.Empty; // create, update, delete
    public string EntityType { get; set; } = string.Empty; // orders, customers, etc.
    public int EntityId { get; set; }
    public string? OldValues { get; set; } // JSON
    public string? NewValues { get; set; } // JSON
    public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public virtual User User { get; set; } = null!;
}
