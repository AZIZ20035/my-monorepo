namespace EidSystem.API.Models.DTOs.Requests;

public class CreateAreaRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public decimal DeliveryCost { get; set; }
    public int SortOrder { get; set; }
}

public class UpdateAreaRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public decimal DeliveryCost { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

// Sizes
public class CreateSizeRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public int SortOrder { get; set; }
}

public class UpdateSizeRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

// Portions
public class CreatePortionRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public decimal Multiplier { get; set; } = 1.00m;
    public int SortOrder { get; set; }
}

public class UpdatePortionRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

// Plate Types
public class CreatePlateTypeRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public int SortOrder { get; set; }
}

public class UpdatePlateTypeRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
