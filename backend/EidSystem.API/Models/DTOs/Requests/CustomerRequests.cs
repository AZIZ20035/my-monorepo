namespace EidSystem.API.Models.DTOs.Requests;

public class CreateCustomerRequest
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Phone2 { get; set; }
    public string? WhatsappNumber { get; set; }
    public string? Notes { get; set; }
    public CreateCustomerAddressRequest? Address { get; set; }
}

public class UpdateCustomerRequest
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Phone2 { get; set; }
    public string? WhatsappNumber { get; set; }
    public string? ServiceStatus { get; set; }
    public string? Notes { get; set; }
    public bool? IsActive { get; set; }
}

public class CreateCustomerAddressRequest
{
    public int AreaId { get; set; }
    public string AddressDetails { get; set; } = string.Empty;
    public string? Label { get; set; }
    public bool IsDefault { get; set; } = false;
}

public class UpdateCustomerAddressRequest
{
    public int? AreaId { get; set; }
    public string? AddressDetails { get; set; }
    public string? Label { get; set; }
    public bool? IsDefault { get; set; }
}
