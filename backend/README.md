# 🐑 Eid Sacrifices Management System API

نظام إدارة ذبائح العيد - واجهة برمجية متكاملة لإدارة طلبات الذبائح والأضاحي

## 📋 الوصف

نظام متكامل لإدارة طلبات ذبائح العيد يشمل:
- إدارة المنتجات والتصنيفات
- إدارة العملاء والعناوين
- إدارة الطلبات والمدفوعات
- إدارة فترات التوصيل والسعة
- تقارير ولوحة تحكم

## 🛠️ التقنيات المستخدمة

- **Backend**: ASP.NET Core 8 Web API
- **Database**: SQL Server 2019
- **ORM**: Entity Framework Core 8
- **Authentication**: JWT Bearer Token
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: BCrypt

## 📁 هيكل المشروع

```
EidSystem.API/
├── Controllers/          # API endpoints
├── Data/                 # DbContext & Seeder
├── Exceptions/           # Custom exceptions
├── Helpers/              # JWT & Password helpers
├── Middleware/           # Exception middleware
├── Models/
│   ├── DTOs/            # Request/Response DTOs
│   └── Entities/        # Database entities
├── Repositories/         # Data access layer
│   ├── Interfaces/
│   └── Implementations/
└── Services/            # Business logic
    ├── Interfaces/
    └── Implementations/
```

## 🗄️ الكيانات (17 Entity)

| Entity | الوصف |
|--------|-------|
| User | المستخدمين (admin, call_center, order_reviewer) |
| Category | تصنيفات المنتجات |
| Product | المنتجات |
| Size | الأحجام |
| Portion | الأجزاء (كامل/نصف) |
| ProductPrice | أسعار المنتجات |
| PlateType | أنواع الأطباق |
| ProductPlate | ربط المنتجات بالأطباق |
| Area | مناطق التوصيل |
| Customer | العملاء |
| CustomerAddress | عناوين العملاء |
| EidDay | أيام العيد |
| DayPeriod | فترات اليوم |
| EidDayPeriod | فترات أيام العيد مع السعة |
| Order | الطلبات |
| OrderItem | عناصر الطلب |
| OrderPayment | المدفوعات |
| ActivityLog | سجل النشاطات |

## 🚀 التشغيل

### المتطلبات
- .NET 8 SDK
- SQL Server 2019+

### خطوات التشغيل

```bash
# 1. استنساخ المشروع
git clone https://github.com/AZIZ20035/EidSystem.git
cd EidSystem/EidSystem.API

# 2. تعديل connection string في appsettings.json

# 3. تحميل الحزم
dotnet restore

# 4. إنشاء قاعدة البيانات
dotnet ef migrations add InitialCreate
dotnet ef database update

# 5. تشغيل المشروع
dotnet run
```

### الوصول للـ API
- **Swagger UI**: `http://localhost:5282/swagger`

## 🔐 بيانات الدخول الافتراضية

| Username | Password | Role |
|----------|----------|------|
| admin | Admin@123 | admin |

## 📡 API Endpoints

### Auth
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - المستخدم الحالي
- `POST /api/auth/change-password` - تغيير كلمة المرور

### Users (Admin only)
- `GET /api/users` - جميع المستخدمين
- `POST /api/users` - إنشاء مستخدم
- `PUT /api/users/{id}` - تعديل مستخدم
- `DELETE /api/users/{id}` - حذف مستخدم

### Categories
- `GET /api/categories` - التصنيفات
- `POST /api/categories` - إنشاء تصنيف
- `PUT /api/categories/{id}` - تعديل تصنيف

### Products
- `GET /api/products` - المنتجات
- `GET /api/products/sizes` - الأحجام
- `GET /api/products/portions` - الأجزاء
- `GET /api/products/plate-types` - أنواع الأطباق

### Customers
- `GET /api/customers` - العملاء
- `GET /api/customers/search?phone=` - بحث برقم الهاتف
- `POST /api/customers` - إنشاء عميل
- `POST /api/customers/{id}/addresses` - إضافة عنوان

### Orders
- `GET /api/orders` - الطلبات
- `GET /api/orders/today` - طلبات اليوم
- `POST /api/orders` - إنشاء طلب
- `PATCH /api/orders/{id}/status` - تحديث الحالة
- `POST /api/orders/{id}/payments` - إضافة دفعة

### Dashboard
- `GET /api/dashboard/stats` - إحصائيات
- `GET /api/dashboard/period-availability` - توفر الفترات

## 📄 License

MIT License

---

⭐ **Developed for Eid Al-Adha Season** ⭐
