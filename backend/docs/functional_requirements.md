# 📋 Functional Requirements Document
# نظام إدارة ذبائح العيد - Eid Sacrifices Management System

---

## 1. مراجعة Schema

### ✅ ملاحظات إيجابية

| الجدول | الملاحظة |
|--------|----------|
| `categories` | ممتاز - مرن لإضافة تصنيفات جديدة |
| `products` | ممتاز - `plate_option` فكرة ذكية |
| `sizes` + `portions` | ممتاز - فصل الأحجام والحصص للمرونة |
| `product_prices` | ممتاز - ربط المنتج بالحجم والحصة بسعر محدد |
| `plate_types` + `product_plates` | ممتاز - Many-to-Many للأطباق |
| `areas` | ممتاز - مع تكلفة التوصيل |
| `customers` + `customer_addresses` | ممتاز - عناوين متعددة لكل عميل |
| `users` | ممتاز - 3 أدوار واضحة |
| `day_periods` + `eid_days` + `eid_day_periods` | ممتاز - تصميم مرن للفترات |
| `orders` + `order_items` | ممتاز - كامل مع الحالات والمبالغ |
| `order_payments` | ممتاز - دفعات متعددة + استرداد |
| `activity_logs` | ممتاز - شامل مع JSON للقيم |
| `whatsapp_logs` | ممتاز - للمستقبل |

### ⚠️ ملاحظات/اقتراحات بسيطة

1. **`orders.order_number`**: تأكد من وجود Trigger أو Logic لتوليده تلقائياً
2. **`eid_day_periods.available_amount`**: Generated Column ممتازة
3. **`users.role`**: أضفت `order_reviewer` بدل `kitchen` - تأكد من المسمى المطلوب

### 📊 ملخص الجداول (17 جدول)

```
التصنيفات والمنتجات:
├── categories (التصنيفات)
├── products (المنتجات)
├── sizes (الأحجام)
├── portions (الحصص)
├── product_prices (أسعار المنتجات)
├── plate_types (أنواع الأطباق)
└── product_plates (ربط المنتجات بالأطباق)

العملاء:
├── customers (العملاء)
├── customer_addresses (عناوين العملاء)
└── areas (المناطق)

الفترات:
├── day_periods (فترات اليوم)
├── eid_days (أيام العيد)
└── eid_day_periods (فترات أيام العيد)

الطلبات:
├── orders (الطلبات)
├── order_items (عناصر الطلب)
└── order_payments (دفعات الطلبات)

النظام:
├── users (المستخدمين)
├── activity_logs (سجل النشاطات)
└── whatsapp_logs (سجل الرسائل)
```

---

## 2. Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | ASP.NET Core 8 Web API |
| **Frontend** | Next.js 14 |
| **Database** | SQL Server 2019 |
| **ORM** | Entity Framework Core |
| **Auth** | JWT (JSON Web Tokens) |
| **API Docs** | Swagger/OpenAPI |

---

## 3. API Endpoints

### 3.1 Auth (المصادقة)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | تسجيل الدخول | Public |
| POST | `/api/auth/logout` | تسجيل الخروج | All |
| GET | `/api/auth/me` | بيانات المستخدم الحالي | All |
| PUT | `/api/auth/change-password` | تغيير كلمة المرور | All |

**Request: Login**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response: Login**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": 1,
    "username": "admin",
    "fullName": "مدير النظام",
    "role": "admin"
  },
  "expiresAt": "2024-02-07T10:00:00Z"
}
```

---

### 3.2 Users (المستخدمين) - Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | قائمة المستخدمين |
| GET | `/api/users/{id}` | بيانات مستخدم |
| POST | `/api/users` | إضافة مستخدم |
| PUT | `/api/users/{id}` | تعديل مستخدم |
| DELETE | `/api/users/{id}` | حذف/تعطيل مستخدم |
| PUT | `/api/users/{id}/reset-password` | إعادة تعيين كلمة المرور |

---

### 3.3 Categories (التصنيفات) - Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | قائمة التصنيفات |
| GET | `/api/categories/{id}` | تصنيف محدد |
| POST | `/api/categories` | إضافة تصنيف |
| PUT | `/api/categories/{id}` | تعديل تصنيف |
| DELETE | `/api/categories/{id}` | حذف/تعطيل |

---

### 3.4 Products (المنتجات)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/products` | قائمة المنتجات | All |
| GET | `/api/products/{id}` | منتج محدد | All |
| GET | `/api/products/by-category/{categoryId}` | منتجات تصنيف | All |
| POST | `/api/products` | إضافة منتج | Admin |
| PUT | `/api/products/{id}` | تعديل منتج | Admin |
| DELETE | `/api/products/{id}` | حذف/تعطيل | Admin |

---

### 3.5 Product Prices (الأسعار)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/products/{productId}/prices` | أسعار منتج | All |
| POST | `/api/products/{productId}/prices` | إضافة سعر | Admin |
| PUT | `/api/product-prices/{id}` | تعديل سعر | Admin |
| DELETE | `/api/product-prices/{id}` | حذف سعر | Admin |

---

### 3.6 Sizes & Portions (الأحجام والحصص)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/sizes` | قائمة الأحجام | All |
| POST | `/api/sizes` | إضافة حجم | Admin |
| PUT | `/api/sizes/{id}` | تعديل حجم | Admin |
| GET | `/api/portions` | قائمة الحصص | All |
| POST | `/api/portions` | إضافة حصة | Admin |
| PUT | `/api/portions/{id}` | تعديل حصة | Admin |

---

### 3.7 Plate Types (أنواع الأطباق)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/plate-types` | قائمة الأطباق | All |
| POST | `/api/plate-types` | إضافة نوع | Admin |
| PUT | `/api/plate-types/{id}` | تعديل نوع | Admin |

---

### 3.8 Areas (المناطق)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/areas` | قائمة المناطق | All |
| POST | `/api/areas` | إضافة منطقة | Admin |
| PUT | `/api/areas/{id}` | تعديل منطقة | Admin |

---

### 3.9 Customers (العملاء)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/customers` | قائمة العملاء | Admin, CallCenter |
| GET | `/api/customers/{id}` | عميل محدد | Admin, CallCenter |
| GET | `/api/customers/search?phone={phone}` | بحث برقم الهاتف | Admin, CallCenter |
| POST | `/api/customers` | إضافة عميل | Admin, CallCenter |
| PUT | `/api/customers/{id}` | تعديل عميل | Admin, CallCenter |
| GET | `/api/customers/{id}/addresses` | عناوين العميل | Admin, CallCenter |
| POST | `/api/customers/{id}/addresses` | إضافة عنوان | Admin, CallCenter |
| PUT | `/api/customer-addresses/{id}` | تعديل عنوان | Admin, CallCenter |

---

### 3.10 Eid Days & Periods (أيام العيد والفترات)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/eid-days` | قائمة أيام العيد | All |
| POST | `/api/eid-days` | إضافة يوم | Admin |
| PUT | `/api/eid-days/{id}` | تعديل يوم | Admin |
| GET | `/api/day-periods` | قائمة الفترات | All |
| POST | `/api/day-periods` | إضافة فترة | Admin |
| GET | `/api/eid-day-periods` | فترات أيام العيد | All |
| GET | `/api/eid-day-periods/available` | الفترات المتاحة فقط | All |
| PUT | `/api/eid-day-periods/{id}` | تعديل طاقة فترة | Admin |

---

### 3.11 Orders (الطلبات)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/orders` | قائمة الطلبات | All |
| GET | `/api/orders/{id}` | طلب محدد | All |
| GET | `/api/orders/by-number/{orderNumber}` | بحث برقم الطلب | All |
| POST | `/api/orders` | إنشاء طلب جديد | Admin, CallCenter |
| PUT | `/api/orders/{id}` | تعديل طلب | Admin |
| PUT | `/api/orders/{id}/status` | تغيير حالة الطلب | All |
| DELETE | `/api/orders/{id}` | إلغاء طلب | Admin |

**Filters للقائمة:**
```
GET /api/orders?status=pending&date=2024-02-06&eidDayId=1&periodId=2
```

**Request: Create Order**
```json
{
  "customerId": 1,
  "addressId": 1,
  "eidDayPeriodId": 5,
  "deliveryDate": "2024-06-17",
  "deliveryTime": "10:00",
  "paidAmount": 500,
  "notes": "ملاحظة",
  "items": [
    {
      "productPriceId": 10,
      "plateId": 2,
      "quantity": 2,
      "notes": "بدون بصل"
    }
  ]
}
```

---

### 3.12 Order Payments (الدفعات)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/orders/{orderId}/payments` | دفعات طلب | All |
| POST | `/api/orders/{orderId}/payments` | إضافة دفعة | Admin, CallCenter |
| DELETE | `/api/order-payments/{id}` | حذف دفعة | Admin |

---

### 3.13 Reports (التقارير) - 7 تقارير

| # | التقرير | Endpoint | الوصف | Role |
|---|---------|----------|-------|------|
| 1 | **فاتورة العميل** | GET `/api/reports/customer-invoice/{orderId}` | بيانات العميل، طلباته، مكان التوصيل، إجمالي الفاتورة، المبلغ المتبقي (ترقيم يبدأ من 100) | All |
| 2 | **فاتورة المطبخ** | GET `/api/reports/kitchen?date={date}&periodId={id}` | إجمالي المنتجات والصحون حسب التصنيف لكل فترة | Admin, OrderReviewer |
| 3 | **تقرير الإدارة** | GET `/api/reports/management?date={date}` | عدد الذبائح وتوزع الطبخ اليومية حسب كل فترة + الإجمالي اليومي + عدد الطلبات لكامل اليوم | Admin |
| 4 | **تقرير المالية** | GET `/api/reports/financial?startDate={}&endDate={}` | حساب كل الفواتير (المدفوع، المتبقي، الإجمالي) | Admin |
| 5 | **تقرير المواصلات** | GET `/api/reports/delivery?date={date}&periodId={id}` | لكل فترة الأحياء حسب ترتيبها المالي | Admin |
| 6 | **فاتورة التسليم** | GET `/api/reports/delivery-receipt/{orderId}` | نفس فاتورة العميل + مربع للصح أمام كل خانة + مكان لاسم المراجع | All |
| 7 | **معلومات العملاء** | GET `/api/reports/customers-info?date={date}` | الاسم، رقم التلفون، عميل قديم/جديد، عمل حجز أو لم يتوفر له الحجز | Admin |

**تصدير Excel:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/export/kitchen?date={date}` | تصدير تقرير المطبخ |
| GET | `/api/reports/export/management?date={date}` | تصدير تقرير الإدارة |
| GET | `/api/reports/export/financial` | تصدير تقرير المالية |
| GET | `/api/reports/export/delivery?date={date}` | تصدير تقرير المواصلات |
| GET | `/api/reports/export/customers-info` | تصدير معلومات العملاء |

---

### 3.14 Dashboard (لوحة التحكم)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | إحصائيات عامة | Admin |
| GET | `/api/dashboard/today-orders` | طلبات اليوم | All |
| GET | `/api/dashboard/period-availability` | توفر الفترات | All |

**Response: Stats**
```json
{
  "totalOrders": 150,
  "todayOrders": 25,
  "pendingOrders": 10,
  "totalRevenue": 75000,
  "todayRevenue": 12500,
  "unpaidAmount": 5000,
  "topProducts": [...]
}
```

---

### 3.15 Activity Logs (سجل النشاطات) - Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity-logs` | قائمة النشاطات |
| GET | `/api/activity-logs/by-user/{userId}` | نشاطات مستخدم |
| GET | `/api/activity-logs/by-entity/{entityType}/{entityId}` | نشاطات سجل |

---

## 4. Business Rules

### 4.1 قواعد الطلبات

```csharp
// BR-001: لا يمكن الحجز إذا امتلأت الطاقة
if (eidDayPeriod.CurrentOrders >= eidDayPeriod.MaxCapacity)
    throw new BusinessException("الفترة ممتلئة");

// BR-002: لا يمكن تعديل طلب تم تسليمه
if (order.Status == OrderStatus.Delivered)
    throw new BusinessException("لا يمكن تعديل طلب تم تسليمه");

// BR-003: تحديث current_orders عند إنشاء/إلغاء طلب
// Increment on Create, Decrement on Cancel

// BR-004: حساب remaining_amount تلقائياً
order.RemainingAmount = order.TotalCost - order.PaidAmount;

// BR-005: تحديث payment_status تلقائياً
if (order.PaidAmount == 0) order.PaymentStatus = "unpaid";
else if (order.PaidAmount < order.TotalCost) order.PaymentStatus = "partial";
else order.PaymentStatus = "paid";
```

### 4.2 قواعد المستخدمين

```csharp
// BR-006: Admin فقط يمكنه إدارة المستخدمين
// BR-007: لا يمكن للمستخدم حذف نفسه
// BR-008: تشفير كلمات المرور باستخدام BCrypt
```

### 4.3 قواعد المنتجات

```csharp
// BR-009: منتج plate_option = 'choice' يجب اختيار طبق
// BR-010: منتج plate_option = 'none' لا يحتاج طبق
// BR-011: السعر يُحفظ وقت الطلب (لا يتأثر بتغيير الأسعار)
```

---

## 5. DTOs (Data Transfer Objects)

### 5.1 Request DTOs

```csharp
// CreateOrderRequest
public class CreateOrderRequest
{
    public int CustomerId { get; set; }
    public int? AddressId { get; set; }
    public int EidDayPeriodId { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public TimeSpan? DeliveryTime { get; set; }
    public decimal PaidAmount { get; set; }
    public string? Notes { get; set; }
    public List<OrderItemRequest> Items { get; set; }
}

// OrderItemRequest
public class OrderItemRequest
{
    public int ProductPriceId { get; set; }
    public int? PlateId { get; set; }
    public int Quantity { get; set; }
    public string? Notes { get; set; }
}

// UpdateOrderStatusRequest
public class UpdateOrderStatusRequest
{
    public string Status { get; set; } // pending, confirmed, preparing, ready, delivered, cancelled
}
```

### 5.2 Response DTOs

```csharp
// OrderResponse
public class OrderResponse
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; }
    public CustomerSummary Customer { get; set; }
    public string DeliveryDate { get; set; }
    public string DeliveryTime { get; set; }
    public string PeriodName { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DeliveryCost { get; set; }
    public decimal TotalCost { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal RemainingAmount { get; set; }
    public string PaymentStatus { get; set; }
    public string Status { get; set; }
    public List<OrderItemResponse> Items { get; set; }
    public string CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

---

## 6. Project Structure (ASP.NET Core) - Repository Pattern

### 6.1 هيكل المشروع

```
EidSystem.API/
├── Controllers/                    ← API Endpoints
│   ├── AuthController.cs
│   ├── UsersController.cs
│   ├── CategoriesController.cs
│   ├── ProductsController.cs
│   ├── CustomersController.cs
│   ├── AreasController.cs
│   ├── EidDaysController.cs
│   ├── OrdersController.cs
│   ├── ReportsController.cs
│   ├── DashboardController.cs
│   └── SettingsController.cs
│
├── Services/                       ← Business Logic
│   ├── Interfaces/
│   │   ├── IAuthService.cs
│   │   ├── IUserService.cs
│   │   ├── ICategoryService.cs
│   │   ├── IProductService.cs
│   │   ├── ICustomerService.cs
│   │   ├── IOrderService.cs
│   │   ├── IReportService.cs
│   │   └── IDashboardService.cs
│   └── Implementations/
│       ├── AuthService.cs
│       ├── UserService.cs
│       ├── CategoryService.cs
│       ├── ProductService.cs
│       ├── CustomerService.cs
│       ├── OrderService.cs
│       ├── ReportService.cs
│       └── DashboardService.cs
│
├── Repositories/                   ← Data Access Layer
│   ├── Interfaces/
│   │   ├── IGenericRepository.cs
│   │   ├── IUserRepository.cs
│   │   ├── ICategoryRepository.cs
│   │   ├── IProductRepository.cs
│   │   ├── ICustomerRepository.cs
│   │   ├── IAreaRepository.cs
│   │   ├── IEidDayPeriodRepository.cs
│   │   ├── IOrderRepository.cs
│   │   └── IActivityLogRepository.cs
│   └── Implementations/
│       ├── GenericRepository.cs
│       ├── UserRepository.cs
│       ├── CategoryRepository.cs
│       ├── ProductRepository.cs
│       ├── CustomerRepository.cs
│       ├── AreaRepository.cs
│       ├── EidDayPeriodRepository.cs
│       ├── OrderRepository.cs
│       └── ActivityLogRepository.cs
│
├── Models/
│   ├── Entities/                   ← Database Models
│   │   ├── User.cs
│   │   ├── Category.cs
│   │   ├── Product.cs
│   │   ├── ProductPrice.cs
│   │   ├── Size.cs
│   │   ├── Portion.cs
│   │   ├── PlateType.cs
│   │   ├── Customer.cs
│   │   ├── CustomerAddress.cs
│   │   ├── Area.cs
│   │   ├── EidDay.cs
│   │   ├── DayPeriod.cs
│   │   ├── EidDayPeriod.cs
│   │   ├── Order.cs
│   │   ├── OrderItem.cs
│   │   ├── OrderPayment.cs
│   │   ├── ActivityLog.cs
│   │   └── WhatsappLog.cs
│   └── DTOs/
│       ├── Requests/
│       │   ├── LoginRequest.cs
│       │   ├── CreateOrderRequest.cs
│       │   ├── CreateCustomerRequest.cs
│       │   └── ...
│       └── Responses/
│           ├── LoginResponse.cs
│           ├── OrderResponse.cs
│           ├── CustomerResponse.cs
│           └── ...
│
├── Data/
│   ├── AppDbContext.cs
│   ├── DbInitializer.cs           ← Seed Data
│   └── Configurations/            ← Fluent API Configs
│       ├── UserConfiguration.cs
│       ├── OrderConfiguration.cs
│       └── ...
│
├── Middleware/
│   ├── JwtMiddleware.cs
│   ├── ExceptionMiddleware.cs
│   └── ActivityLogMiddleware.cs
│
├── Helpers/
│   ├── OrderNumberGenerator.cs
│   ├── PasswordHasher.cs
│   ├── JwtHelper.cs
│   └── ExcelExporter.cs
│
├── Exceptions/
│   ├── BusinessException.cs
│   ├── NotFoundException.cs
│   └── UnauthorizedException.cs
│
├── appsettings.json
├── appsettings.Development.json
└── Program.cs
```

### 6.2 Generic Repository (Base)

```csharp
// Repositories/Interfaces/IGenericRepository.cs
public interface IGenericRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

// Repositories/Implementations/GenericRepository.cs
public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;
    
    public GenericRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }
    
    public virtual async Task<T?> GetByIdAsync(int id)
        => await _dbSet.FindAsync(id);
    
    public virtual async Task<IEnumerable<T>> GetAllAsync()
        => await _dbSet.ToListAsync();
    
    public virtual async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
    
    public virtual async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }
    
    public virtual async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
    
    public async Task<bool> ExistsAsync(int id)
        => await _dbSet.FindAsync(id) != null;
}
```

### 6.3 Specific Repository Example (Order)

```csharp
// Repositories/Interfaces/IOrderRepository.cs
public interface IOrderRepository : IGenericRepository<Order>
{
    Task<Order?> GetByOrderNumberAsync(string orderNumber);
    Task<IEnumerable<Order>> GetByDateAsync(DateTime date);
    Task<IEnumerable<Order>> GetByPeriodAsync(int eidDayPeriodId);
    Task<IEnumerable<Order>> GetByCustomerAsync(int customerId);
    Task<IEnumerable<Order>> GetByStatusAsync(string status);
    Task<string> GenerateOrderNumberAsync();
    Task UpdateStatusAsync(int orderId, string status);
    Task<decimal> GetTotalRevenueAsync(DateTime? startDate, DateTime? endDate);
}

// Repositories/Implementations/OrderRepository.cs
public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context) { }
    
    public override async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Address)
            .Include(o => o.Items)
                .ThenInclude(i => i.ProductPrice)
                    .ThenInclude(pp => pp.Product)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.Period)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.OrderId == id);
    }
    
    public async Task<IEnumerable<Order>> GetByDateAsync(DateTime date)
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .Where(o => o.DeliveryDate == date.Date)
            .OrderBy(o => o.DeliveryTime)
            .ToListAsync();
    }
    
    public async Task<string> GenerateOrderNumberAsync()
    {
        var lastOrder = await _context.Orders
            .OrderByDescending(o => o.OrderId)
            .FirstOrDefaultAsync();
        
        int nextNumber = (lastOrder?.OrderId ?? 99) + 1;
        return $"ORD-{nextNumber:D6}"; // ORD-000100
    }
    
    public async Task UpdateStatusAsync(int orderId, string status)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order != null)
        {
            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }
}
```

### 6.4 Service Example (Order)

```csharp
// Services/Interfaces/IOrderService.cs
public interface IOrderService
{
    Task<OrderResponse> GetByIdAsync(int id);
    Task<IEnumerable<OrderResponse>> GetAllAsync(OrderFilterRequest filter);
    Task<OrderResponse> CreateAsync(CreateOrderRequest request, int userId);
    Task<OrderResponse> UpdateAsync(int id, UpdateOrderRequest request);
    Task UpdateStatusAsync(int id, string status, int userId);
    Task CancelAsync(int id, int userId);
    Task<PaymentResponse> AddPaymentAsync(int orderId, AddPaymentRequest request, int userId);
}

// Services/Implementations/OrderService.cs
public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepo;
    private readonly ICustomerRepository _customerRepo;
    private readonly IEidDayPeriodRepository _periodRepo;
    private readonly IActivityLogRepository _logRepo;
    private readonly IMapper _mapper;
    
    public OrderService(
        IOrderRepository orderRepo,
        ICustomerRepository customerRepo,
        IEidDayPeriodRepository periodRepo,
        IActivityLogRepository logRepo,
        IMapper mapper)
    {
        _orderRepo = orderRepo;
        _customerRepo = customerRepo;
        _periodRepo = periodRepo;
        _logRepo = logRepo;
        _mapper = mapper;
    }
    
    public async Task<OrderResponse> CreateAsync(CreateOrderRequest request, int userId)
    {
        // 1. Validate Period Availability
        var period = await _periodRepo.GetByIdAsync(request.EidDayPeriodId);
        if (period == null)
            throw new NotFoundException("الفترة غير موجودة");
        
        if (period.CurrentOrders >= period.MaxCapacity)
            throw new BusinessException("الفترة ممتلئة، يرجى اختيار فترة أخرى");
        
        // 2. Get or Create Customer
        var customer = await _customerRepo.GetByIdAsync(request.CustomerId);
        if (customer == null)
            throw new NotFoundException("العميل غير موجود");
        
        // 3. Generate Order Number
        var orderNumber = await _orderRepo.GenerateOrderNumberAsync();
        
        // 4. Calculate Totals
        var subtotal = CalculateSubtotal(request.Items);
        var deliveryCost = await GetDeliveryCost(request.AddressId);
        var totalCost = subtotal + deliveryCost;
        
        // 5. Create Order
        var order = new Order
        {
            OrderNumber = orderNumber,
            CustomerId = request.CustomerId,
            AddressId = request.AddressId,
            EidDayPeriodId = request.EidDayPeriodId,
            DeliveryDate = request.DeliveryDate,
            DeliveryTime = request.DeliveryTime,
            Subtotal = subtotal,
            DeliveryCost = deliveryCost,
            TotalCost = totalCost,
            PaidAmount = request.PaidAmount,
            RemainingAmount = totalCost - request.PaidAmount,
            PaymentStatus = DeterminePaymentStatus(request.PaidAmount, totalCost),
            Status = "pending",
            Notes = request.Notes,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow
        };
        
        // 6. Add Items
        order.Items = request.Items.Select(i => new OrderItem
        {
            ProductPriceId = i.ProductPriceId,
            PlateId = i.PlateId,
            Quantity = i.Quantity,
            UnitPrice = GetUnitPrice(i.ProductPriceId),
            Notes = i.Notes
        }).ToList();
        
        // 7. Save
        var createdOrder = await _orderRepo.AddAsync(order);
        
        // 8. Increment Period Orders
        await _periodRepo.IncrementOrdersAsync(request.EidDayPeriodId);
        
        // 9. Log Activity
        await _logRepo.LogAsync(userId, "create", "orders", createdOrder.OrderId, null, order);
        
        return _mapper.Map<OrderResponse>(createdOrder);
    }
}
```

### 6.5 Dependency Injection (Program.cs)

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IAreaRepository, AreaRepository>();
builder.Services.AddScoped<IEidDayPeriodRepository, EidDayPeriodRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IActivityLogRepository, ActivityLogRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Helpers
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtHelper, JwtHelper>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* JWT Config */ });

// Swagger
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed Data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
    await DbInitializer.Initialize(context, hasher);
}

// Middleware
app.UseMiddleware<ExceptionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ActivityLogMiddleware>();

app.MapControllers();
app.Run();
```

### 6.6 الـ Repositories المطلوبة

| Repository | Methods إضافية |
|------------|----------------|
| `IUserRepository` | `GetByUsernameAsync`, `GetByRoleAsync` |
| `ICategoryRepository` | `GetActiveAsync`, `GetWithProductsAsync` |
| `IProductRepository` | `GetByCategoryAsync`, `GetWithPricesAsync`, `GetActiveAsync` |
| `ICustomerRepository` | `GetByPhoneAsync`, `GetWithAddressesAsync`, `GetWithOrdersAsync` |
| `IAreaRepository` | `GetActiveAsync` |
| `IEidDayPeriodRepository` | `GetByDateAsync`, `GetAvailableAsync`, `IncrementOrdersAsync`, `DecrementOrdersAsync` |
| `IOrderRepository` | `GetByDateAsync`, `GetByPeriodAsync`, `GetByCustomerAsync`, `GenerateOrderNumberAsync`, `UpdateStatusAsync` |
| `IActivityLogRepository` | `LogAsync`, `GetByUserAsync`, `GetByEntityAsync` |
```

---

## 7. Implementation Priority

### Phase 1: Core Setup (Day 1-2)
- [ ] إنشاء المشروع
- [ ] إعداد Entity Framework + DbContext
- [ ] إعداد JWT Authentication
- [ ] Auth Controller (Login/Logout)

### Phase 2: Master Data (Day 3-4)
- [ ] Categories CRUD
- [ ] Products + Prices CRUD
- [ ] Sizes + Portions CRUD
- [ ] Plate Types CRUD
- [ ] Areas CRUD

### Phase 3: Customers (Day 5)
- [ ] Customers CRUD
- [ ] Customer Addresses CRUD
- [ ] Search by Phone

### Phase 4: Eid Days & Periods (Day 6)
- [ ] Eid Days CRUD
- [ ] Day Periods CRUD
- [ ] Eid Day Periods with Availability

### Phase 5: Orders (Day 7-9)
- [ ] Create Order (with validation)
- [ ] Update Order
- [ ] Update Order Status
- [ ] Order Payments
- [ ] Cancel Order

### Phase 6: Reports (Day 10-12)
- [ ] Customer Invoice
- [ ] Receipt
- [ ] Accounting Report
- [ ] Kitchen Report
- [ ] Products Summary
- [ ] Delivery Schedule
- [ ] Period Occupancy
- [ ] Export to Excel

### Phase 7: Dashboard & Finishing (Day 13-14)
- [ ] Dashboard Stats
- [ ] Activity Logs
- [ ] Testing
- [ ] Bug Fixes

---

## 8. Seed Data (البيانات الأولية)

### 8.1 Admin User (مستخدم الأدمن)

```csharp
// في ملف Data/DbInitializer.cs أو في Program.cs
public static async Task SeedAdminUser(AppDbContext context, IPasswordHasher hasher)
{
    if (!await context.Users.AnyAsync(u => u.Role == "admin"))
    {
        var admin = new User
        {
            Username = "admin",
            PasswordHash = hasher.HashPassword("Admin@123"),
            FullName = "مدير النظام",
            Role = "admin",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(admin);
        await context.SaveChangesAsync();
    }
}
```

### 8.2 بيانات الـ Seed الكاملة

```sql
-- Admin User
INSERT INTO users (username, password_hash, full_name, role, is_active, created_at)
VALUES ('admin', '[HASHED_PASSWORD]', N'مدير النظام', 'admin', 1, GETDATE());

-- Sizes
INSERT INTO sizes (name_ar, is_active, sort_order) VALUES 
(N'وسط', 1, 1),
(N'كبير', 1, 2);

-- Portions
INSERT INTO portions (name_ar, multiplier, is_active, sort_order) VALUES 
(N'كامل', 1.00, 1, 1),
(N'نصف', 0.50, 1, 2);

-- Plate Types
INSERT INTO plate_types (name_ar, is_active, sort_order) VALUES 
(N'مستطيل', 1, 1),
(N'طولي جديد', 1, 2),
(N'دائري', 1, 3);

-- Categories
INSERT INTO categories (name_ar, is_active, sort_order) VALUES 
(N'الذبائح', 1, 1),
(N'منتجات الدجاج واللحم', 1, 2),
(N'المنتجات الأخرى', 1, 3);
```

### 8.3 استدعاء الـ Seed في Program.cs

```csharp
// Program.cs
var app = builder.Build();

// Seed Data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    var hasher = services.GetRequiredService<IPasswordHasher>();
    
    await DbInitializer.SeedAdminUser(context, hasher);
    await DbInitializer.SeedLookupData(context);
}
```

---

## 9. Endpoints الإضافية (ناقصة)

### 9.1 Settings (الإعدادات) - Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | جميع الإعدادات |
| GET | `/api/settings/{key}` | إعداد محدد |
| PUT | `/api/settings/{key}` | تعديل إعداد |

### 9.2 Order Number Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/next-number` | رقم الطلب التالي (للعرض قبل الحفظ) |

### 9.3 Customers - Endpoints إضافية

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/customers/{id}/orders` | طلبات العميل السابقة | All |
| GET | `/api/customers/new-vs-returning` | إحصائية العملاء الجدد vs القدامى | Admin |
| PUT | `/api/customers/{id}/service-status` | تحديث حالة الخدمة (served/not_served) | Admin |

### 9.4 Orders - Endpoints إضافية

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/orders/today` | طلبات اليوم | All |
| GET | `/api/orders/by-period/{eidDayPeriodId}` | طلبات فترة معينة | All |
| GET | `/api/orders/by-customer/{customerId}` | طلبات عميل | All |
| PUT | `/api/orders/{id}/review` | مراجعة الطلب (للـ Order Reviewer) | OrderReviewer |
| GET | `/api/orders/pending-review` | طلبات تنتظر المراجعة | OrderReviewer |

### 9.5 Period Availability

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/eid-day-periods/{id}/availability` | توفر فترة محددة | All |
| GET | `/api/eid-day-periods/by-date/{date}` | فترات يوم محدد | All |

### 9.6 WhatsApp - للمستقبل

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/whatsapp/send/{orderId}` | إرسال رسالة للعميل | Admin, CallCenter |
| GET | `/api/whatsapp/logs` | سجل الرسائل | Admin |

---

## 10. ملخص الـ Endpoints النهائي

| المجموعة | عدد Endpoints |
|----------|---------------|
| Auth | 4 |
| Users | 6 |
| Categories | 5 |
| Products | 6 |
| Product Prices | 4 |
| Sizes | 3 |
| Portions | 3 |
| Plate Types | 3 |
| Areas | 3 |
| Customers | 12 |
| Eid Days & Periods | 10 |
| Orders | 15 |
| Order Payments | 3 |
| Reports | 12 |
| Export Reports | 5 |
| Dashboard | 3 |
| Activity Logs | 3 |
| Settings | 3 |
| WhatsApp (Future) | 2 |
| **الإجمالي** | **~100 endpoint** |

---

## 11. Approval Checklist

- [x] مراجعة Schema (17 جدول) ✅
- [x] تحديث Tech Stack (SQL Server 2019) ✅
- [x] API Endpoints (~100 endpoint) ✅
- [x] التقارير الـ 7 ✅
- [x] Seed Data للـ Admin ✅
- [x] Business Rules ✅
- [ ] **الموافقة النهائية للبدء**

---

**تاريخ الإنشاء**: 2026-02-06  
**آخر تحديث**: 2026-02-06

