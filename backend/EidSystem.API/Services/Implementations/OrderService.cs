using EidSystem.API.Data;
using EidSystem.API.Exceptions;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using EidSystem.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IEidDayPeriodRepository _periodRepository;
    private readonly IActivityLogRepository _activityLogRepository;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IWhatsAppService _whatsAppService;
    private readonly AppDbContext _context;

    public OrderService(
        IOrderRepository orderRepository,
        IEidDayPeriodRepository periodRepository,
        IActivityLogRepository activityLogRepository,
        IServiceScopeFactory scopeFactory,
        IWhatsAppService whatsAppService,
        AppDbContext context)
    {
        _orderRepository = orderRepository;
        _periodRepository = periodRepository;
        _activityLogRepository = activityLogRepository;
        _scopeFactory = scopeFactory;
        _whatsAppService = whatsAppService;
        _context = context;
    }

    public async Task<PaginatedResponse<OrderListResponse>> GetAllAsync(OrderFilterRequest filter)
    {
        var query = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .Include(o => o.EidDayPeriod).ThenInclude(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(o => o.EidDayPeriod).ThenInclude(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Category)
            .Include(o => o.EidDayPeriod).ThenInclude(edp => edp.EidDay)
            .AsQueryable();

        if (filter.EidDayId.HasValue)
            query = query.Where(o => o.EidDayPeriod.EidDayId == filter.EidDayId.Value);
        if (filter.PeriodId.HasValue)
            query = query.Where(o => o.EidDayPeriod.DayPeriodCategory.PeriodId == filter.PeriodId.Value);
        if (!string.IsNullOrEmpty(filter.Status))
            query = query.Where(o => o.Status == filter.Status);
        if (!string.IsNullOrEmpty(filter.PaymentStatus))
            query = query.Where(o => o.PaymentStatus == filter.PaymentStatus);
        if (filter.CustomerId.HasValue)
            query = query.Where(o => o.CustomerId == filter.CustomerId.Value);

        var totalCount = await query.CountAsync();

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PaginatedResponse<OrderListResponse>
        {
            Items = orders.Select(MapToListResponse).ToList(),
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<OrderResponse> GetByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
            throw new NotFoundException("Order", id);
        
        var response = MapToResponse(order);
        response.WhatsAppLink = await _whatsAppService.GetOrderWhatsAppLinkAsync(id);
        return response;
    }



    public async Task<OrderResponse> CreateAsync(CreateOrderRequest request, int userId)
    {
        // Validate period availability
        var period = await _periodRepository.GetWithDetailsAsync(request.EidDayPeriodId);
        if (period == null)
            throw new NotFoundException("الفترة غير موجودة");
        if (!period.IsActive)
            throw new BusinessException("الفترة غير متاحة");
        if (period.CurrentOrders >= period.MaxCapacity)
            throw new BusinessException("الفترة ممتلئة، يرجى اختيار فترة أخرى");

        // Get delivery cost and validate address
        decimal deliveryCost = 0;
        if (request.AddressId.HasValue)
        {
            var address = await _context.CustomerAddresses
                .Include(a => a.Area)
                .FirstOrDefaultAsync(a => a.AddressId == request.AddressId.Value);
            
            if (address == null)
                throw new BusinessException("العنوان غير موجود");
            
            if (address.CustomerId != request.CustomerId)
                throw new BusinessException("العنوان المختار لا ينتمي لهذا العميل");

            deliveryCost = address.Area?.DeliveryCost ?? 0;
        }

        // Calculate subtotal
        decimal subtotal = 0;
        var orderItems = new List<OrderItem>();
        foreach (var item in request.Items)
        {
            var productPrice = await _context.ProductPrices
                .Include(pp => pp.Product)
                .FirstOrDefaultAsync(pp => pp.ProductPriceId == item.ProductPriceId);
            
            if (productPrice == null)
                throw new NotFoundException("ProductPrice", item.ProductPriceId);

            var unitPrice = productPrice.Price;
            var totalPrice = unitPrice * item.Quantity;
            subtotal += totalPrice;

            orderItems.Add(new OrderItem
            {
                ProductPriceId = item.ProductPriceId,
                PlateTypeId = item.PlateTypeId,
                Quantity = item.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = totalPrice,
                Notes = item.Notes
            });
        }

        Console.WriteLine($"[OrderService] Creating order for Customer {request.CustomerId}, Period {request.EidDayPeriodId}");

        var totalCost = subtotal + deliveryCost;
        var remainingAmount = totalCost - request.PaidAmount;

        // Null guards for navigation properties needed for defaults
        var deliveryDate = request.DeliveryDate ?? period.EidDay?.Date ?? DateTime.Today;
        var deliveryTime = request.DeliveryTime ?? period.DayPeriodCategory?.Period?.StartTime ?? TimeSpan.Zero;

        var order = new Order
        {
            CustomerId = request.CustomerId,
            AddressId = request.AddressId,
            EidDayPeriodId = request.EidDayPeriodId,
            DeliveryDate = deliveryDate,
            DeliveryTime = deliveryTime,
            Subtotal = subtotal,
            DeliveryCost = deliveryCost,
            TotalCost = totalCost,
            PaidAmount = request.PaidAmount,
            RemainingAmount = remainingAmount,
            PaymentStatus = DeterminePaymentStatus(request.PaidAmount, totalCost),
            Status = "pending",
            Notes = request.Notes,
            CreatedBy = userId,
            CreatedAt = DateTime.Now,
            Items = orderItems
        };

        await _orderRepository.AddAsync(order);

        // Add initial payment if paid
        if (request.PaidAmount > 0)
        {
            var payment = new OrderPayment
            {
                OrderId = order.OrderId,
                Amount = request.PaidAmount,
                PaymentMethod = "cash",
                CreatedBy = userId,
                CreatedAt = DateTime.Now
            };
            _context.OrderPayments.Add(payment);
            await _context.SaveChangesAsync();
        }

        // Increment period orders
        await _periodRepository.IncrementOrdersAsync(request.EidDayPeriodId);

        // Log activity
        await _activityLogRepository.LogAsync(userId, "create", "orders", order.OrderId, null, order);

        Console.WriteLine($"[OrderService] Order {order.OrderId} created successfully.");
        return await GetByIdAsync(order.OrderId);
    }

    public async Task<OrderResponse> UpdateAsync(int id, UpdateOrderRequest request)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
            throw new NotFoundException("Order", id);

        if (order.Status == "delivered")
            throw new BusinessException("لا يمكن تعديل طلب تم تسليمه");

        var oldPeriodId = order.EidDayPeriodId;

        if (request.AddressId.HasValue) order.AddressId = request.AddressId.Value;
        if (request.DeliveryDate.HasValue) order.DeliveryDate = request.DeliveryDate.Value;
        if (request.DeliveryTime.HasValue) order.DeliveryTime = request.DeliveryTime.Value;
        if (request.Notes != null) order.Notes = request.Notes;
        
        if (request.EidDayPeriodId.HasValue && request.EidDayPeriodId.Value != oldPeriodId)
        {
            var period = await _periodRepository.GetWithDetailsAsync(request.EidDayPeriodId.Value);
            if (period == null || !period.IsActive)
                throw new BusinessException("الفترة غير متاحة");
            if (period.CurrentOrders >= period.MaxCapacity)
                throw new BusinessException("الفترة ممتلئة");

            order.EidDayPeriodId = request.EidDayPeriodId.Value;
            await _periodRepository.DecrementOrdersAsync(oldPeriodId);
            await _periodRepository.IncrementOrdersAsync(request.EidDayPeriodId.Value);
        }

        order.UpdatedAt = DateTime.Now;
        await _orderRepository.UpdateAsync(order);

        return await GetByIdAsync(id);
    }

    public async Task UpdateStatusAsync(int id, string status, int userId)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
            throw new NotFoundException("Order", id);

        var oldStatus = order.Status;
        order.Status = status;
        order.UpdatedAt = DateTime.Now;

        await _orderRepository.UpdateAsync(order);
        await _activityLogRepository.LogAsync(userId, "update_status", "orders", id, 
            new { Status = oldStatus }, new { Status = status });
    }

    public async Task CancelAsync(int id, int userId)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
            throw new NotFoundException("Order", id);

        if (order.Status == "delivered")
            throw new BusinessException("لا يمكن إلغاء طلب تم تسليمه");

        order.Status = "cancelled";
        order.UpdatedAt = DateTime.Now;

        await _orderRepository.UpdateAsync(order);
        await _periodRepository.DecrementOrdersAsync(order.EidDayPeriodId);
        await _activityLogRepository.LogAsync(userId, "cancel", "orders", id, null, null);
    }

    public async Task<PaymentResponse> AddPaymentAsync(int orderId, AddPaymentRequest request, int userId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
            throw new NotFoundException("Order", orderId);

        var payment = new OrderPayment
        {
            OrderId = orderId,
            Amount = request.Amount,
            PaymentMethod = request.PaymentMethod,
            IsRefund = request.IsRefund,
            Notes = request.Notes,
            CreatedBy = userId,
            CreatedAt = DateTime.Now
        };

        _context.OrderPayments.Add(payment);

        // Update order amounts
        if (request.IsRefund)
            order.PaidAmount -= request.Amount;
        else
            order.PaidAmount += request.Amount;

        order.RemainingAmount = order.TotalCost - order.PaidAmount;
        order.PaymentStatus = DeterminePaymentStatus(order.PaidAmount, order.TotalCost);
        order.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);
        return new PaymentResponse
        {
            PaymentId = payment.PaymentId,
            Amount = payment.Amount,
            PaymentMethod = payment.PaymentMethod,
            IsRefund = payment.IsRefund,
            Notes = payment.Notes,
            CreatedBy = user?.FullName ?? "",
            CreatedAt = payment.CreatedAt
        };
    }

    public async Task<IEnumerable<OrderListResponse>> GetTodayOrdersAsync()
    {
        var orders = await _orderRepository.GetTodayOrdersAsync();
        return orders.Select(MapToListResponse);
    }

    public async Task<IEnumerable<OrderListResponse>> GetByPeriodAsync(int eidDayPeriodId)
    {
        var orders = await _orderRepository.GetByPeriodAsync(eidDayPeriodId);
        return orders.Select(MapToListResponse);
    }

    private static string DeterminePaymentStatus(decimal paid, decimal total)
    {
        if (paid <= 0) return "unpaid";
        if (paid >= total) return "paid";
        return "partial";
    }

    private static OrderListResponse MapToListResponse(Order o) => new()
    {
        OrderId = o.OrderId,
        CustomerName = o.Customer?.Name ?? "",
        CustomerPhone = o.Customer?.Phone ?? "",
        PeriodName = o.EidDayPeriod?.DayPeriodCategory?.Period?.NameAr ?? "",
        DeliveryDate = o.DeliveryDate,
        TotalCost = o.TotalCost,
        RemainingAmount = o.RemainingAmount,
        PaymentStatus = o.PaymentStatus,
        Status = o.Status,
        ItemCount = o.Items?.Count ?? 0,
        CreatedAt = o.CreatedAt
    };

    private OrderResponse MapToResponse(Order o) => new()
    {
        OrderId = o.OrderId,
        Customer = new CustomerSummary
        {
            CustomerId = o.Customer?.CustomerId ?? 0,
            Name = o.Customer?.Name ?? "",
            Phone = o.Customer?.Phone ?? ""
        },
        Address = o.Address != null ? new CustomerAddressResponse
        {
            AddressId = o.Address.AddressId,
            AreaId = o.Address.AreaId,
            AreaName = o.Address.Area?.NameAr ?? "",
            AddressDetails = o.Address.AddressDetails,
            Label = o.Address.Label,
            IsDefault = o.Address.IsDefault,
            DeliveryCost = o.Address.Area?.DeliveryCost ?? 0
        } : null,
        Period = new EidDayPeriodResponse
        {
            EidDayPeriodId = o.EidDayPeriod?.EidDayPeriodId ?? 0,
            EidDayId = o.EidDayPeriod?.EidDayId ?? 0,
            EidDayName = o.EidDayPeriod?.EidDay?.NameAr ?? "",
            EidDayDate = o.EidDayPeriod?.EidDay?.Date ?? DateTime.MinValue,
            DayPeriodCategoryId = o.EidDayPeriod?.DayPeriodCategoryId ?? 0,
            PeriodName = o.EidDayPeriod?.DayPeriodCategory?.Period?.NameAr ?? "",
            CategoryName = o.EidDayPeriod?.DayPeriodCategory?.Category?.NameAr ?? "",
            StartTime = o.EidDayPeriod?.DayPeriodCategory?.Period?.StartTime ?? TimeSpan.Zero,
            EndTime = o.EidDayPeriod?.DayPeriodCategory?.Period?.EndTime ?? TimeSpan.Zero,
            MaxCapacity = o.EidDayPeriod?.MaxCapacity ?? 0,
            CurrentOrders = o.EidDayPeriod?.CurrentOrders ?? 0,
            AvailableAmount = o.EidDayPeriod?.AvailableAmount ?? 0
        },
        DeliveryDate = o.DeliveryDate,
        DeliveryTime = o.DeliveryTime,
        Subtotal = o.Subtotal,
        DeliveryCost = o.DeliveryCost,
        TotalCost = o.TotalCost,
        PaidAmount = o.PaidAmount,
        RemainingAmount = o.RemainingAmount,
        PaymentStatus = o.PaymentStatus,
        Status = o.Status,
        Notes = o.Notes,
        CreatedBy = o.CreatedByUser?.FullName ?? "",
        CreatedAt = o.CreatedAt,
        Items = o.Items?.Select(i => new OrderItemResponse
        {
            OrderItemId = i.OrderItemId,
            ProductPriceId = i.ProductPriceId,
            ProductName = i.ProductPrice?.Product?.NameAr ?? "",
            SizeName = i.ProductPrice?.Size?.NameAr,
            PortionName = i.ProductPrice?.Portion?.NameAr,
            PlateTypeId = i.PlateTypeId,
            PlateTypeName = i.PlateType?.NameAr,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            TotalPrice = i.TotalPrice,
            Notes = i.Notes
        }).ToList() ?? new(),
        Payments = o.Payments?.Select(p => new PaymentResponse
        {
            PaymentId = p.PaymentId,
            Amount = p.Amount,
            PaymentMethod = p.PaymentMethod,
            IsRefund = p.IsRefund,
            Notes = p.Notes,
            CreatedBy = p.CreatedByUser?.FullName ?? "",
            CreatedAt = p.CreatedAt
        }).ToList() ?? new()
    };
}
