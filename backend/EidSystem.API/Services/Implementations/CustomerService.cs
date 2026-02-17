using EidSystem.API.Data;
using EidSystem.API.Exceptions;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using EidSystem.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Services.Implementations;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly AppDbContext _context;

    public CustomerService(ICustomerRepository customerRepository, AppDbContext context)
    {
        _customerRepository = customerRepository;
        _context = context;
    }

    public async Task<IEnumerable<CustomerResponse>> GetAllAsync()
    {
        var customers = await _context.Customers
            .Include(c => c.Addresses).ThenInclude(a => a.Area)
            .Include(c => c.Orders)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
        return customers.Select(MapToResponse);
    }

    public async Task<CustomerResponse?> GetByPhoneAsync(string phone)
    {
        var customer = await _customerRepository.GetByPhoneAsync(phone);
        if (customer == null) return null;
        
        var orderCount = await _context.Orders.CountAsync(o => o.CustomerId == customer.CustomerId);
        var response = MapToResponse(customer);
        response.OrderCount = orderCount;
        return response;
    }

    public async Task<CustomerResponse> GetByIdAsync(int id)
    {
        var customer = await _customerRepository.GetWithAddressesAsync(id);
        if (customer == null)
            throw new NotFoundException("Customer", id);
        
        var orderCount = await _context.Orders.CountAsync(o => o.CustomerId == id);
        var response = MapToResponse(customer);
        response.OrderCount = orderCount;
        return response;
    }

    public async Task<CustomerResponse> CreateAsync(CreateCustomerRequest request)
    {
        var existing = await _customerRepository.GetByPhoneAsync(request.Phone);
        if (existing != null)
            throw new BusinessException("رقم الهاتف مسجل مسبقاً");

        var customer = new Customer
        {
            Name = request.Name,
            Phone = request.Phone,
            Phone2 = request.Phone2,
            WhatsappNumber = request.WhatsappNumber,
            Notes = request.Notes,
            ServiceStatus = "not_served",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _customerRepository.AddAsync(customer);

        if (request.Address != null)
        {
            var address = new CustomerAddress
            {
                CustomerId = customer.CustomerId,
                AreaId = request.Address.AreaId,
                AddressDetails = request.Address.AddressDetails,
                Label = request.Address.Label,
                IsDefault = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.CustomerAddresses.Add(address);
            await _context.SaveChangesAsync();
        }

        return await GetByIdAsync(customer.CustomerId);
    }

    public async Task<CustomerResponse> UpdateAsync(int id, UpdateCustomerRequest request)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null)
            throw new NotFoundException("Customer", id);

        if (request.Name != null) customer.Name = request.Name;
        if (request.Phone != null) customer.Phone = request.Phone;
        if (request.Phone2 != null) customer.Phone2 = request.Phone2;
        if (request.WhatsappNumber != null) customer.WhatsappNumber = request.WhatsappNumber;
        if (request.ServiceStatus != null) customer.ServiceStatus = request.ServiceStatus;
        if (request.Notes != null) customer.Notes = request.Notes;
        if (request.IsActive.HasValue) customer.IsActive = request.IsActive.Value;
        customer.UpdatedAt = DateTime.UtcNow;

        await _customerRepository.UpdateAsync(customer);
        return await GetByIdAsync(id);
    }

    public async Task<CustomerAddressResponse> AddAddressAsync(int customerId, CreateCustomerAddressRequest request)
    {
        var customer = await _customerRepository.GetByIdAsync(customerId);
        if (customer == null)
            throw new NotFoundException("Customer", customerId);

        if (request.IsDefault)
        {
            var existingAddresses = await _context.CustomerAddresses
                .Where(a => a.CustomerId == customerId)
                .ToListAsync();
            foreach (var addr in existingAddresses)
                addr.IsDefault = false;
        }

        var address = new CustomerAddress
        {
            CustomerId = customerId,
            AreaId = request.AreaId,
            AddressDetails = request.AddressDetails,
            Label = request.Label,
            IsDefault = request.IsDefault,
            CreatedAt = DateTime.UtcNow
        };

        _context.CustomerAddresses.Add(address);
        await _context.SaveChangesAsync();

        var area = await _context.Areas.FindAsync(request.AreaId);
        return MapAddressToResponse(address, area);
    }

    public async Task<CustomerAddressResponse> UpdateAddressAsync(int addressId, UpdateCustomerAddressRequest request)
    {
        var address = await _context.CustomerAddresses
            .Include(a => a.Area)
            .FirstOrDefaultAsync(a => a.AddressId == addressId);
        
        if (address == null)
            throw new NotFoundException("CustomerAddress", addressId);

        if (request.AreaId.HasValue) address.AreaId = request.AreaId.Value;
        if (request.AddressDetails != null) address.AddressDetails = request.AddressDetails;
        if (request.Label != null) address.Label = request.Label;
        if (request.IsDefault.HasValue && request.IsDefault.Value)
        {
            var otherAddresses = await _context.CustomerAddresses
                .Where(a => a.CustomerId == address.CustomerId && a.AddressId != addressId)
                .ToListAsync();
            foreach (var addr in otherAddresses)
                addr.IsDefault = false;
            address.IsDefault = true;
        }

        await _context.SaveChangesAsync();

        var area = await _context.Areas.FindAsync(address.AreaId);
        return MapAddressToResponse(address, area);
    }

    public async Task<IEnumerable<OrderListResponse>> GetOrdersAsync(int customerId)
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .Include(o => o.EidDayPeriod).ThenInclude(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(o => new OrderListResponse
        {
            OrderId = o.OrderId,
            CustomerName = "",
            CustomerPhone = "",
            PeriodName = o.EidDayPeriod?.DayPeriodCategory?.Period?.NameAr ?? "",
            DeliveryDate = o.DeliveryDate,
            TotalCost = o.TotalCost,
            RemainingAmount = o.RemainingAmount,
            PaymentStatus = o.PaymentStatus,
            Status = o.Status,
            ItemCount = o.Items.Count,
            CreatedAt = o.CreatedAt
        });
    }

    private static CustomerResponse MapToResponse(Customer c) => new()
    {
        CustomerId = c.CustomerId,
        Name = c.Name,
        Phone = c.Phone,
        Phone2 = c.Phone2,
        WhatsappNumber = c.WhatsappNumber,
        ServiceStatus = c.ServiceStatus,
        Notes = c.Notes,
        IsActive = c.IsActive,
        IsNewCustomer = c.Orders?.Count == 0,
        OrderCount = c.Orders?.Count ?? 0,
        CreatedAt = c.CreatedAt,
        Addresses = c.Addresses?.Select(a => MapAddressToResponse(a, a.Area)).ToList() ?? new()
    };

    private static CustomerAddressResponse MapAddressToResponse(CustomerAddress a, Area? area) => new()
    {
        AddressId = a.AddressId,
        AreaId = a.AreaId,
        AreaName = area?.NameAr ?? a.Area?.NameAr ?? "",
        AddressDetails = a.AddressDetails,
        Label = a.Label,
        IsDefault = a.IsDefault,
        DeliveryCost = area?.DeliveryCost ?? a.Area?.DeliveryCost ?? 0
    };
}
