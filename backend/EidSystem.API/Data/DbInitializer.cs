using EidSystem.API.Models.Entities;
using EidSystem.API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Data;

public static class DbInitializer
{
    public static async Task Initialize(AppDbContext context, IPasswordHasher hasher)
    {
        Console.WriteLine("[DbInitializer] Starting database initialization...");

        // Ensure database is created - Removing this as we use Migrate() in Program.cs
        // await context.Database.EnsureCreatedAsync();

        // Seed Admin User
        await SeedAdminUser(context, hasher);
        
        // Seed Normal Users
        await SeedNormalUsers(context, hasher);

        // Seed Lookup Data
        Console.WriteLine("[DbInitializer] Seeding lookup data...");
        await SeedSizes(context);
        await SeedPortions(context);
        await SeedPlateTypes(context);
        await SeedCategories(context);
        await SeedAreas(context);
        await SeedEidDays(context);
        
        Console.WriteLine("[DbInitializer] Seeding operational data (Periods, Products, etc.)...");
        await SeedPeriods(context);
        await SeedProducts(context);
        await SeedEidDayPeriods(context);
        await SeedTestData(context);

        // Print helper IDs for the developer
        var testCustomer = await context.Customers.OrderBy(c => c.CustomerId).FirstOrDefaultAsync();
        var testAddress = await context.CustomerAddresses.OrderBy(a => a.AddressId).FirstOrDefaultAsync();
        var testPeriod = await context.EidDayPeriods.OrderBy(p => p.EidDayPeriodId).FirstOrDefaultAsync();
        var testPrice = await context.ProductPrices.OrderBy(p => p.ProductPriceId).FirstOrDefaultAsync();

        Console.WriteLine("=================================================");
        Console.WriteLine("🚀 USE THESE IDs IN SWAGGER FOR TESTING:");
        Console.WriteLine($"   CustomerId: {testCustomer?.CustomerId}");
        Console.WriteLine($"   AddressId: {testAddress?.AddressId}");
        Console.WriteLine($"   EidDayPeriodId: {testPeriod?.EidDayPeriodId}");
        Console.WriteLine($"   ProductPriceId: {testPrice?.ProductPriceId}");
        Console.WriteLine("=================================================");

        Console.WriteLine("[DbInitializer] Database initialization completed successfully.");
    }

    private static async Task SeedAdminUser(AppDbContext context, IPasswordHasher hasher)
    {
        // Create or update an admin user with fixed credentials for development
        var adminUsername = "admin";
        var adminPassword = "admin1234";
        var adminFullName = "مدير النظام";

        var admin = await context.Users.FirstOrDefaultAsync(u => u.Role == "admin" || u.Username == adminUsername);

        if (admin == null)
        {
            admin = new User
            {
                Username = adminUsername,
                PasswordHash = hasher.HashPassword(adminPassword),
                FullName = adminFullName,
                Role = "admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(admin);
        }
        else
        {
            // Update existing admin to ensure known credentials
            admin.Username = adminUsername;
            admin.PasswordHash = hasher.HashPassword(adminPassword);
            admin.FullName = adminFullName;
            admin.Role = "admin";
            admin.IsActive = true;
            admin.UpdatedAt = DateTime.UtcNow;
            context.Users.Update(admin);
        }

        await context.SaveChangesAsync();

        // Output seeded credentials so developer can log in
        Console.WriteLine($"[DbInitializer] Admin credentials -> username: '{adminUsername}', password: '{adminPassword}'");
    }

    private static async Task SeedNormalUsers(AppDbContext context, IPasswordHasher hasher)
    {
        // Create or update normal user with fixed credentials for development/testing
        var normalUsername = "user";
        var normalPassword = "user1234";
        var normalFullName = "موظف مركز الاتصال";

        var normalUser = await context.Users.FirstOrDefaultAsync(u => u.Username == normalUsername);

        if (normalUser == null)
        {
            normalUser = new User
            {
                Username = normalUsername,
                PasswordHash = hasher.HashPassword(normalPassword),
                FullName = normalFullName,
                Role = "call_center",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(normalUser);
        }
        else
        {
            // Update existing user to ensure known credentials
            normalUser.PasswordHash = hasher.HashPassword(normalPassword);
            normalUser.FullName = normalFullName;
            normalUser.Role = "call_center";
            normalUser.IsActive = true;
            normalUser.UpdatedAt = DateTime.UtcNow;
            context.Users.Update(normalUser);
        }

        await context.SaveChangesAsync();

        // Output seeded credentials
        Console.WriteLine($"[DbInitializer] Normal user credentials -> username: '{normalUsername}', password: '{normalPassword}'");
    }

    private static async Task SeedSizes(AppDbContext context)
    {
        if (!await context.Sizes.AnyAsync())
        {
            var sizes = new List<Size>
            {
                new Size { NameAr = "وسط", NameEn = "Medium", SortOrder = 1, IsActive = true },
                new Size { NameAr = "كبير", NameEn = "Large", SortOrder = 2, IsActive = true }
            };
            context.Sizes.AddRange(sizes);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedPortions(AppDbContext context)
    {
        if (!await context.Portions.AnyAsync())
        {
            var portions = new List<Portion>
            {
                new Portion { NameAr = "كامل", NameEn = "Full", Multiplier = 1.00m, SortOrder = 1, IsActive = true },
                new Portion { NameAr = "نصف", NameEn = "Half", Multiplier = 0.50m, SortOrder = 2, IsActive = true }
            };
            context.Portions.AddRange(portions);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedPlateTypes(AppDbContext context)
    {
        if (!await context.PlateTypes.AnyAsync())
        {
            var plateTypes = new List<PlateType>
            {
                new PlateType { NameAr = "مستطيل", NameEn = "Rectangle", SortOrder = 1, IsActive = true },
                new PlateType { NameAr = "طولي جديد", NameEn = "New Long", SortOrder = 2, IsActive = true },
                new PlateType { NameAr = "دائري", NameEn = "Circular", SortOrder = 3, IsActive = true }
            };
            context.PlateTypes.AddRange(plateTypes);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedCategories(AppDbContext context)
    {
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new Category { NameAr = "الذبائح", NameEn = "Sacrifices", SortOrder = 1, IsActive = true },
                new Category { NameAr = "منتجات الدجاج واللحم", NameEn = "Chicken & Meat Products", SortOrder = 2, IsActive = true },
                new Category { NameAr = "المنتجات الأخرى", NameEn = "Other Products", SortOrder = 3, IsActive = true }
            };
            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedAreas(AppDbContext context)
    {
        if (!await context.Areas.AnyAsync())
        {
            var areas = new List<Area>
            {
                new Area { NameAr = "ابحر الجنوبية", DeliveryCost = 0, SortOrder = 1, IsActive = true },
                new Area { NameAr = "ابحر الشمالية", DeliveryCost = 0, SortOrder = 2, IsActive = true },
                new Area { NameAr = "الرياض", DeliveryCost = 0, SortOrder = 3, IsActive = true },
                new Area { NameAr = "الصفا", DeliveryCost = 0, SortOrder = 4, IsActive = true },
                new Area { NameAr = "السلامة", DeliveryCost = 0, SortOrder = 5, IsActive = true },
                new Area { NameAr = "الحمراء", DeliveryCost = 0, SortOrder = 6, IsActive = true },
                new Area { NameAr = "النعيم", DeliveryCost = 0, SortOrder = 7, IsActive = true },
                new Area { NameAr = "البوادي", DeliveryCost = 0, SortOrder = 8, IsActive = true },
                new Area { NameAr = "المروة", DeliveryCost = 0, SortOrder = 9, IsActive = true },
                new Area { NameAr = "الروضة", DeliveryCost = 0, SortOrder = 10, IsActive = true }
            };
            context.Areas.AddRange(areas);
            await context.SaveChangesAsync();
        }
    }
    private static async Task SeedEidDays(AppDbContext context)
    {
        var count = await context.EidDays.CountAsync();
        Console.WriteLine($"[DbInitializer] EidDays count: {count}");
        if (count == 0)
        {
            Console.WriteLine("[DbInitializer] Seeding EidDays...");
            var eidDays = new List<EidDay>();
            var startDate = DateTime.Today;

            string[] namesAr = {
                "اليوم الأول", "اليوم الثاني", "اليوم الثالث", "اليوم الرابع", "اليوم الخامس",
                "اليوم السادس", "اليوم السابع", "اليوم الثامن", "اليوم التاسع", "اليوم العاشر"
            };

            string[] namesEn = {
                "Day 1", "Day 2", "Day 3", "Day 4", "Day 5",
                "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"
            };

            for (int i = 0; i < 10; i++)
            {
                eidDays.Add(new EidDay
                {
                    NameAr = namesAr[i],
                    NameEn = namesEn[i],
                    Date = startDate.AddDays(i),
                    DayNumber = i + 1,
                    IsActive = true,
                    SortOrder = i + 1
                });
            }

            context.EidDays.AddRange(eidDays);
            await context.SaveChangesAsync();
            Console.WriteLine("[DbInitializer] EidDays seeded.");
        }
    }

    private static async Task SeedPeriods(AppDbContext context)
    {
        var count = await context.DayPeriods.CountAsync();
        Console.WriteLine($"[DbInitializer] DayPeriods count: {count}");
        if (count == 0)
        {
            Console.WriteLine("[DbInitializer] Seeding DayPeriods...");
            var periods = new List<DayPeriod>
            {
                new DayPeriod { NameAr = "الفترة الأولى", NameEn = "Period 1", StartTime = new TimeSpan(8, 0, 0), EndTime = new TimeSpan(11, 0, 0), SortOrder = 1, IsActive = true },
                new DayPeriod { NameAr = "الفترة الثانية", NameEn = "Period 2", StartTime = new TimeSpan(11, 0, 0), EndTime = new TimeSpan(14, 0, 0), SortOrder = 2, IsActive = true },
                new DayPeriod { NameAr = "الفترة الثالثة", NameEn = "Period 3", StartTime = new TimeSpan(14, 0, 0), EndTime = new TimeSpan(17, 0, 0), SortOrder = 3, IsActive = true }
            };

            context.DayPeriods.AddRange(periods);
            await context.SaveChangesAsync();
            Console.WriteLine("[DbInitializer] DayPeriods seeded.");
        }
    }

    private static async Task SeedProducts(AppDbContext context)
    {
        var count = await context.Products.CountAsync();
        Console.WriteLine($"[DbInitializer] Products count: {count}");
        if (count == 0)
        {
            Console.WriteLine("[DbInitializer] Seeding Products...");
            var category = await context.Categories.FirstAsync();
            var size = await context.Sizes.FirstAsync();
            var portion = await context.Portions.FirstAsync();

            var product = new Product
            {
                NameAr = "ذبيحة سواكني",
                NameEn = "Sawakni Sacrifice",
                CategoryId = category.CategoryId,
                PlateOption = "required",
                IsActive = true,
                SortOrder = 1,
                CreatedAt = DateTime.UtcNow
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var price = new ProductPrice
            {
                ProductId = product.ProductId,
                SizeId = size.SizeId,
                PortionId = portion.PortionId,
                Price = 1200.00m,
                IsActive = true
            };
            context.ProductPrices.Add(price);
            await context.SaveChangesAsync();
            Console.WriteLine("[DbInitializer] Products seeded.");
        }
    }

    private static async Task SeedEidDayPeriods(AppDbContext context)
    {
        var count = await context.EidDayPeriods.CountAsync();
        Console.WriteLine($"[DbInitializer] EidDayPeriods count: {count}");
        if (count == 0)
        {
            Console.WriteLine("[DbInitializer] Seeding EidDayPeriods...");
            var eidDay = await context.EidDays.FirstAsync();
            var period = await context.DayPeriods.FirstAsync();
            var category = await context.Categories.FirstAsync();

            // First create DayPeriodCategory
            var dpc = await context.DayPeriodCategories
                .FirstOrDefaultAsync(x => x.PeriodId == period.PeriodId && x.CategoryId == category.CategoryId);
            
            if (dpc == null)
            {
                dpc = new DayPeriodCategory
                {
                    PeriodId = period.PeriodId,
                    CategoryId = category.CategoryId
                };
                context.DayPeriodCategories.Add(dpc);
                await context.SaveChangesAsync();
            }

            var edp = new EidDayPeriod
            {
                EidDayId = eidDay.EidDayId,
                DayPeriodCategoryId = dpc.DayPeriodCategoryId,
                MaxCapacity = 50,
                CurrentOrders = 0,
                IsActive = true
            };
            context.EidDayPeriods.Add(edp);
            await context.SaveChangesAsync();
            Console.WriteLine("[DbInitializer] EidDayPeriods seeded.");
        }
    }

    private static async Task SeedTestData(AppDbContext context)
    {
        var customersCount = await context.Customers.CountAsync();
        Console.WriteLine($"[DbInitializer] Customers count: {customersCount}");
        
        Customer customer;
        if (customersCount == 0)
        {
            Console.WriteLine("[DbInitializer] Seeding Test Customer...");
            customer = new Customer
            {
                Name = "تجربة عميل",
                Phone = "0500000000",
                ServiceStatus = "active",
                CreatedAt = DateTime.UtcNow
            };
            context.Customers.Add(customer);
            await context.SaveChangesAsync();
        }
        else
        {
            customer = await context.Customers.FirstAsync();
        }

        var addressesCount = await context.CustomerAddresses.CountAsync(a => a.CustomerId == customer.CustomerId);
        Console.WriteLine($"[DbInitializer] Addresses count for Customer {customer.CustomerId}: {addressesCount}");
        
        if (addressesCount == 0)
        {
            Console.WriteLine("[DbInitializer] Seeding Test Address...");
            var area = await context.Areas.FirstAsync();
            var address = new CustomerAddress
            {
                CustomerId = customer.CustomerId,
                AreaId = area.AreaId,
                AddressDetails = "شارع الاختبار، مجمع التجربة",
                Label = "المنزل",
                IsDefault = true,
                CreatedAt = DateTime.UtcNow
            };
            context.CustomerAddresses.Add(address);
            await context.SaveChangesAsync();
        }
        
        Console.WriteLine("[DbInitializer] Test Data (Customer & Address) check completed.");
    }
}
