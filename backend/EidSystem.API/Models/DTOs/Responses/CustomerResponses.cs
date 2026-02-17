namespace EidSystem.API.Models.DTOs.Responses;

public class CustomerResponse
{
    public int CustomerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Phone2 { get; set; }
    public string? WhatsappNumber { get; set; }
    public string ServiceStatus { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
    public bool IsNewCustomer { get; set; }
    public int OrderCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<CustomerAddressResponse> Addresses { get; set; } = new();
}

public class CustomerAddressResponse
{
    public int AddressId { get; set; }
    public int AreaId { get; set; }
    public string AreaName { get; set; } = string.Empty;
    public string AddressDetails { get; set; } = string.Empty;
    public string? Label { get; set; }
    public bool IsDefault { get; set; }
    public decimal DeliveryCost { get; set; }
}

public class CustomerSummary
{
    public int CustomerId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}
