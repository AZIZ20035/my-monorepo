namespace EidSystem.API.Models.Entities;

public class ProductPlate
{
    public int ProductPlateId { get; set; }
    public int ProductId { get; set; }
    public int PlateTypeId { get; set; }

    // Navigation
    public virtual Product Product { get; set; } = null!;
    public virtual PlateType PlateType { get; set; } = null!;
}
