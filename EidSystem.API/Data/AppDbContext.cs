using EidSystem.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Users & Auth
    public DbSet<User> Users { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<WhatsappLog> WhatsappLogs { get; set; }

    // Products
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Size> Sizes { get; set; }
    public DbSet<Portion> Portions { get; set; }
    public DbSet<ProductPrice> ProductPrices { get; set; }
    public DbSet<PlateType> PlateTypes { get; set; }
    public DbSet<ProductPlate> ProductPlates { get; set; }

    // Customers
    public DbSet<Area> Areas { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<CustomerAddress> CustomerAddresses { get; set; }

    // Eid Days & Periods
    public DbSet<EidDay> EidDays { get; set; }
    public DbSet<DayPeriod> DayPeriods { get; set; }
    public DbSet<DayPeriodCategory> DayPeriodCategories { get; set; }
    public DbSet<EidDayPeriod> EidDayPeriods { get; set; }

    // Orders
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<OrderPayment> OrderPayments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
        });

        // Category Configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId);
            entity.Property(e => e.NameAr).IsRequired().HasMaxLength(100);
            entity.Property(e => e.NameEn).HasMaxLength(100);
        });

        // Product Configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId);
            entity.Property(e => e.NameAr).IsRequired().HasMaxLength(100);
            entity.Property(e => e.NameEn).HasMaxLength(100);
            entity.Property(e => e.PlateOption).IsRequired().HasMaxLength(20);

            entity.HasOne(e => e.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Size Configuration
        modelBuilder.Entity<Size>(entity =>
        {
            entity.HasKey(e => e.SizeId);
            entity.Property(e => e.NameAr).IsRequired().HasMaxLength(50);
        });

        // Portion Configuration
        modelBuilder.Entity<Portion>(entity =>
        {
            entity.HasKey(e => e.PortionId);
            entity.Property(e => e.NameAr).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Multiplier).HasPrecision(5, 2);
        });

        // ProductPrice Configuration
        modelBuilder.Entity<ProductPrice>(entity =>
        {
            entity.HasKey(e => e.ProductPriceId);
            entity.Property(e => e.Price).HasPrecision(10, 2);

            entity.HasOne(e => e.Product)
                .WithMany(p => p.Prices)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Size)
                .WithMany(s => s.ProductPrices)
                .HasForeignKey(e => e.SizeId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Portion)
                .WithMany(p => p.ProductPrices)
                .HasForeignKey(e => e.PortionId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // PlateType Configuration
        modelBuilder.Entity<PlateType>(entity =>
        {
            entity.HasKey(e => e.PlateTypeId);
            entity.Property(e => e.NameAr).IsRequired().HasMaxLength(50);
        });

        // ProductPlate Configuration (Many-to-Many)
        modelBuilder.Entity<ProductPlate>(entity =>
        {
            entity.HasKey(e => e.ProductPlateId);
            entity.HasIndex(e => new { e.ProductId, e.PlateTypeId }).IsUnique();

            entity.HasOne(e => e.Product)
                .WithMany(p => p.ProductPlates)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.PlateType)
                .WithMany(pt => pt.ProductPlates)
                .HasForeignKey(e => e.PlateTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Area Configuration
        modelBuilder.Entity<Area>(entity =>
        {
            entity.HasKey(e => e.AreaId);
            entity.Property(e => e.NameAr).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DeliveryCost).HasPrecision(10, 2);
        });

        // Customer Configuration
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.Phone);
            entity.Property(e => e.ServiceStatus).HasMaxLength(20);
        });

        // CustomerAddress Configuration
        modelBuilder.Entity<CustomerAddress>(entity =>
        {
            entity.HasKey(e => e.AddressId);
            entity.Property(e => e.AddressDetails).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Label).HasMaxLength(50);

            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Addresses)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Area)
                .WithMany(a => a.CustomerAddresses)
                .HasForeignKey(e => e.AreaId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // EidDay Configuration
        modelBuilder.Entity<EidDay>(entity =>
        {
            entity.HasKey(e => e.EidDayId);
            entity.Property(e => e.NameAr).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Date).IsUnique();
        });

        // DayPeriod Configuration
        modelBuilder.Entity<DayPeriod>(entity =>
        {
            entity.HasKey(e => e.PeriodId);
            entity.Property(e => e.NameAr).IsRequired().HasMaxLength(100);
        });

        // DayPeriodCategory Configuration
        modelBuilder.Entity<DayPeriodCategory>(entity =>
        {
            entity.HasKey(e => e.DayPeriodCategoryId);
            entity.HasIndex(e => new { e.PeriodId, e.CategoryId }).IsUnique();

            entity.HasOne(e => e.Period)
                .WithMany(p => p.DayPeriodCategories)
                .HasForeignKey(e => e.PeriodId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Category)
                .WithMany(c => c.DayPeriodCategories)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // EidDayPeriod Configuration
        modelBuilder.Entity<EidDayPeriod>(entity =>
        {
            entity.HasKey(e => e.EidDayPeriodId);
            entity.HasIndex(e => new { e.EidDayId, e.DayPeriodCategoryId }).IsUnique();

            entity.HasOne(e => e.EidDay)
                .WithMany(ed => ed.EidDayPeriods)
                .HasForeignKey(e => e.EidDayId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.DayPeriodCategory)
                .WithMany(dpc => dpc.EidDayPeriods)
                .HasForeignKey(e => e.DayPeriodCategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Ignore(e => e.AvailableAmount); // Computed property
        });

        // Order Configuration
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId);
            entity.Property(e => e.OrderId).UseIdentityColumn(100, 1);
            entity.Property(e => e.Subtotal).HasPrecision(10, 2);
            entity.Property(e => e.DeliveryCost).HasPrecision(10, 2);
            entity.Property(e => e.TotalCost).HasPrecision(10, 2);
            entity.Property(e => e.PaidAmount).HasPrecision(10, 2);
            entity.Property(e => e.RemainingAmount).HasPrecision(10, 2);
            entity.Property(e => e.PaymentStatus).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(20);

            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Orders)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Address)
                .WithMany(a => a.Orders)
                .HasForeignKey(e => e.AddressId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.EidDayPeriod)
                .WithMany(edp => edp.Orders)
                .HasForeignKey(e => e.EidDayPeriodId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.CreatedByUser)
                .WithMany(u => u.Orders)
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // OrderItem Configuration
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId);
            entity.Property(e => e.UnitPrice).HasPrecision(10, 2);
            entity.Property(e => e.TotalPrice).HasPrecision(10, 2);

            entity.HasOne(e => e.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ProductPrice)
                .WithMany(pp => pp.OrderItems)
                .HasForeignKey(e => e.ProductPriceId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.PlateType)
                .WithMany(pt => pt.OrderItems)
                .HasForeignKey(e => e.PlateTypeId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // OrderPayment Configuration
        modelBuilder.Entity<OrderPayment>(entity =>
        {
            entity.HasKey(e => e.PaymentId);
            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.PaymentMethod).HasMaxLength(20);

            entity.HasOne(e => e.Order)
                .WithMany(o => o.Payments)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.CreatedByUser)
                .WithMany()
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ActivityLog Configuration
        modelBuilder.Entity<ActivityLog>(entity =>
        {
            entity.HasKey(e => e.LogId);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(50);
            entity.Property(e => e.EntityType).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => new { e.EntityType, e.EntityId });

            entity.HasOne(e => e.User)
                .WithMany(u => u.ActivityLogs)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // WhatsappLog Configuration
        modelBuilder.Entity<WhatsappLog>(entity =>
        {
            entity.HasKey(e => e.LogId);
            entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
            entity.Property(e => e.MessageType).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(20);

            entity.HasOne(e => e.Order)
                .WithMany(o => o.WhatsappLogs)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Customer)
                .WithMany(c => c.WhatsappLogs)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
