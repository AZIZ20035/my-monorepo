# 🛠️ Admin Panel - API Endpoints Guide
# نظام إدارة ذبائح العيد - دليل الـ Frontend Developer

> **Base URL:** `https://localhost:44332/api`
> **Auth:** All requests require `Authorization: Bearer {token}` header
> **Content-Type:** `application/json`

---

## 📦 Standard Response Wrapper

Every response follows this structure:

```json
{
  "success": true,
  "message": "optional message string",
  "data": { },
  "errors": null
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "error description",
  "data": null,
  "errors": ["error1", "error2"]
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "totalCount": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

# Phase 1: Authentication & Core Setup

> **Priority:** 🔴 Critical - Must be done first
> This phase covers login, user session, and the dashboard landing page.

---

## 1.1 Auth - Login

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/login` |
| **Auth** | ❌ Public |

**Request:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "userId": 1,
      "username": "admin",
      "fullName": "مدير النظام",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00"
    },
    "expiresAt": "2024-02-10T10:00:00Z"
  }
}
```

---

## 1.2 Auth - Get Current User

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/auth/me` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "username": "admin",
    "fullName": "مدير النظام",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00"
  }
}
```

---

## 1.3 Auth - Change Password

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/auth/change-password` |
| **Auth** | ✅ All Roles |

**Request:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح"
}
```

---

## 1.4 Auth - Logout

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/logout` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

> ⚠️ **Note:** JWT is stateless. The client must delete the stored token.

---

## 1.5 Dashboard - Stats

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/dashboard/stats` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "todayOrders": 25,
    "pendingOrders": 10,
    "preparingOrders": 5,
    "deliveredOrders": 100,
    "totalRevenue": 75000.00,
    "todayRevenue": 12500.00,
    "unpaidAmount": 5000.00,
    "totalCustomers": 80,
    "newCustomersToday": 3
  }
}
```

---

## 1.6 Dashboard - Period Availability

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/dashboard/period-availability` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "eidDayPeriodId": 1,
      "dayName": "اليوم الأول",
      "periodName": "الفترة الصباحية",
      "available": 5,
      "total": 12,
      "isFull": false
    }
  ]
}
```

---

# Phase 2: Settings & Lookup Data Management

> **Priority:** 🟠 High - Required before Orders
> This phase covers managing the base data: categories, products, prices, areas, sizes, portions, plate types, eid days, and periods.

---

## 2.1 Categories

### GET All Categories

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/categories` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "categoryId": 1,
      "nameAr": "أغنام",
      "nameEn": "Sheep",
      "description": "قسم الأغنام",
      "isActive": true,
      "sortOrder": 1,
      "productCount": 5
    }
  ]
}
```

### GET Category by ID

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/categories/{id}` |
| **Auth** | ✅ All Roles |

### POST Create Category

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/categories` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "أغنام",
  "nameEn": "Sheep",
  "description": "قسم الأغنام",
  "sortOrder": 1
}
```

### PUT Update Category

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/categories/{id}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "أغنام محدث",
  "nameEn": "Sheep Updated",
  "description": "وصف جديد",
  "isActive": true,
  "sortOrder": 2
}
```

### DELETE Category (Soft Delete)

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/categories/{id}` |
| **Auth** | 🔒 Admin Only |

---

## 2.2 Products

### GET All Products

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/products?categoryId={optional}` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": 1,
      "categoryId": 1,
      "categoryName": "أغنام",
      "nameAr": "خروف كامل",
      "nameEn": "Whole Sheep",
      "description": "خروف بلدي",
      "plateOption": "choice",
      "isActive": true,
      "sortOrder": 1,
      "prices": [
        {
          "productPriceId": 1,
          "sizeId": 1,
          "sizeName": "صغير",
          "portionId": null,
          "portionName": null,
          "price": 1500.00,
          "isActive": true
        }
      ],
      "plateTypes": [
        {
          "plateTypeId": 1,
          "nameAr": "صحن كبير",
          "nameEn": "Large Plate",
          "isActive": true,
          "sortOrder": 1
        }
      ]
    }
  ]
}
```

### GET Product by ID

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/products/{id}` |
| **Auth** | ✅ All Roles |

### POST Create Product

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/products` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "categoryId": 1,
  "nameAr": "خروف كامل",
  "nameEn": "Whole Sheep",
  "description": "خروف بلدي كامل",
  "plateOption": "choice",
  "sortOrder": 1,
  "prices": [
    {
      "sizeId": 1,
      "portionId": null,
      "price": 1500.00
    }
  ],
  "plateTypeIds": [1, 2]
}
```

> **plateOption values:** `"none"`, `"choice"`, `"required"`

### PUT Update Product

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/products/{id}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "categoryId": 1,
  "nameAr": "خروف كامل محدث",
  "nameEn": "Updated Sheep",
  "description": "وصف جديد",
  "plateOption": "choice",
  "isActive": true,
  "sortOrder": 2
}
```

### DELETE Product (Soft Delete)

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/products/{id}` |
| **Auth** | 🔒 Admin Only |

---

## 2.3 Product Prices

### GET Prices by Product

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/products/{productId}/prices` |
| **Auth** | ✅ All Roles |

### POST Add Price

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/products/{productId}/prices` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "sizeId": 1,
  "portionId": null,
  "price": 1500.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productPriceId": 5,
    "sizeId": 1,
    "sizeName": "صغير",
    "portionId": null,
    "portionName": null,
    "price": 1500.00,
    "isActive": true
  }
}
```

### PUT Update Price

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/products/prices/{priceId}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "price": 1600.00,
  "isActive": true
}
```

### DELETE Price (Soft Delete)

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/products/prices/{priceId}` |
| **Auth** | 🔒 Admin Only |

---

## 2.4 Sizes

### GET All Sizes

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/products/sizes` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sizeId": 1,
      "nameAr": "صغير",
      "nameEn": "Small",
      "isActive": true,
      "sortOrder": 1
    }
  ]
}
```

### POST Create Size

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/products/sizes` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "صغير",
  "nameEn": "Small",
  "sortOrder": 1
}
```

### PUT Update Size

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/products/sizes/{id}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "صغير محدث",
  "nameEn": "Small Updated",
  "sortOrder": 1,
  "isActive": true
}
```

---

## 2.5 Portions

### GET All Portions

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/products/portions` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "portionId": 1,
      "nameAr": "كامل",
      "nameEn": "Full",
      "multiplier": 1.00,
      "isActive": true,
      "sortOrder": 1
    }
  ]
}
```

### POST Create Portion

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/products/portions` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "نصف",
  "nameEn": "Half",
  "multiplier": 0.50,
  "sortOrder": 2
}
```

### PUT Update Portion

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/products/portions/{id}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "نصف محدث",
  "nameEn": "Half Updated",
  "sortOrder": 2,
  "isActive": true
}
```

---

## 2.6 Plate Types

### GET All Plate Types

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/products/plate-types` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "plateTypeId": 1,
      "nameAr": "صحن كبير",
      "nameEn": "Large Plate",
      "isActive": true,
      "sortOrder": 1
    }
  ]
}
```

### POST Create Plate Type

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/products/plate-types` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "صحن كبير",
  "nameEn": "Large Plate",
  "sortOrder": 1
}
```

### PUT Update Plate Type

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/products/plate-types/{id}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "صحن كبير محدث",
  "nameEn": "Large Plate Updated",
  "sortOrder": 1,
  "isActive": true
}
```

---

## 2.7 Areas

### GET All Areas

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/areas` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "areaId": 1,
      "nameAr": "الرياض - حي النزهة",
      "nameEn": "Riyadh - Nuzha",
      "deliveryCost": 50.00,
      "isActive": true,
      "sortOrder": 1
    }
  ]
}
```

### GET Area by ID

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/areas/{id}` |
| **Auth** | ✅ All Roles |

### POST Create Area

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/areas` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "الرياض - حي النزهة",
  "nameEn": "Riyadh - Nuzha",
  "deliveryCost": 50.00,
  "sortOrder": 1
}
```

### PUT Update Area

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/areas/{id}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "الرياض - حي النزهة محدث",
  "nameEn": "Riyadh - Nuzha Updated",
  "deliveryCost": 60.00,
  "sortOrder": 1,
  "isActive": true
}
```

### DELETE Area (Soft Delete)

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/areas/{id}` |
| **Auth** | 🔒 Admin Only |

---

## 2.8 Eid Days

### GET All Eid Days

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/eiddays` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "eidDayId": 1,
      "nameAr": "اليوم الأول",
      "nameEn": "Day 1",
      "date": "2024-06-17T00:00:00",
      "dayNumber": 1,
      "isActive": true,
      "sortOrder": 1,
      "periods": [
        {
          "eidDayPeriodId": 1,
          "eidDayId": 1,
          "eidDayName": "اليوم الأول",
          "eidDayDate": "2024-06-17T00:00:00",
          "periodId": 1,
          "periodName": "الفترة الصباحية",
          "categoryName": "أغنام",
          "startTime": "06:00:00",
          "endTime": "10:00:00",
          "maxCapacity": 12,
          "currentOrders": 5,
          "availableAmount": 7,
          "isActive": true,
          "isFull": false
        }
      ]
    }
  ]
}
```

### GET Eid Day by ID

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/eiddays/{id}` |
| **Auth** | ✅ All Roles |

### POST Create Eid Day

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/eiddays` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "اليوم الأول",
  "nameEn": "Day 1",
  "date": "2024-06-17",
  "dayNumber": 1,
  "sortOrder": 1
}
```

### PUT Update Eid Day

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/eiddays/{id}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "nameAr": "اليوم الأول محدث",
  "nameEn": "Day 1 Updated",
  "date": "2024-06-17",
  "dayNumber": 1,
  "isActive": true,
  "sortOrder": 1
}
```

### DELETE Eid Day (Soft Delete)

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/eiddays/{id}` |
| **Auth** | 🔒 Admin Only |

---

## 2.9 Day Period Templates

### GET All Period Templates

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/periods/templates` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "periodId": 1,
      "categoryId": 1,
      "categoryName": "أغنام",
      "nameAr": "الفترة الصباحية",
      "nameEn": "Morning",
      "startTime": "06:00:00",
      "endTime": "10:00:00",
      "defaultCapacity": 12,
      "isActive": true,
      "sortOrder": 1
    }
  ]
}
```

### POST Create Period Template

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/periods/templates` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "categoryId": 1,
  "nameAr": "الفترة الصباحية",
  "nameEn": "Morning",
  "startTime": "06:00:00",
  "endTime": "10:00:00",
  "defaultCapacity": 12,
  "sortOrder": 1
}
```

---

## 2.10 Eid Day Periods (Assignment)

### GET All Eid Day Periods

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/periods/eid-day-periods` |
| **Auth** | ✅ All Roles |

### GET Available Periods

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/periods/available?categoryId={optional}` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "eidDayPeriodId": 1,
      "eidDayId": 1,
      "eidDayName": "اليوم الأول",
      "eidDayDate": "2024-06-17T00:00:00",
      "periodId": 1,
      "periodName": "الفترة الصباحية",
      "categoryName": "أغنام",
      "startTime": "06:00:00",
      "endTime": "10:00:00",
      "maxCapacity": 12,
      "currentOrders": 5,
      "availableAmount": 7,
      "isActive": true,
      "isFull": false
    }
  ]
}
```

### POST Assign Period to Day

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/periods/assign` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "eidDayId": 1,
  "periodId": 1,
  "maxCapacity": 12
}
```

### PUT Update Eid Day Period

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/periods/eid-day-periods/{id}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "maxCapacity": 15,
  "isActive": true
}
```

---

# Phase 3: Customers & Orders Management

> **Priority:** 🟡 High - Core business functionality
> This phase covers customer management, order creation, and payment handling.

---

## 3.1 Customers

### GET All Customers

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/customers` |
| **Auth** | ✅ Admin, CallCenter |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "customerId": 1,
      "name": "محمد أحمد",
      "phone": "0501234567",
      "phone2": "0509876543",
      "whatsappNumber": "0501234567",
      "serviceStatus": "active",
      "notes": null,
      "isActive": true,
      "isNewCustomer": true,
      "orderCount": 3,
      "createdAt": "2024-01-15T10:00:00",
      "addresses": [
        {
          "addressId": 1,
          "areaId": 1,
          "areaName": "حي النزهة",
          "addressDetails": "شارع الملك فهد، بجوار المسجد",
          "label": "المنزل",
          "isDefault": true,
          "deliveryCost": 50.00
        }
      ]
    }
  ]
}
```

### GET Customer by ID

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/customers/{id}` |
| **Auth** | ✅ Admin, CallCenter |

### GET Search by Phone

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/customers/search?phone=0501234567` |
| **Auth** | ✅ Admin, CallCenter |

### POST Create Customer

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/customers` |
| **Auth** | ✅ Admin, CallCenter |

**Request:**
```json
{
  "name": "محمد أحمد",
  "phone": "0501234567",
  "phone2": "0509876543",
  "whatsappNumber": "0501234567",
  "notes": "عميل مميز",
  "address": {
    "areaId": 1,
    "addressDetails": "شارع الملك فهد، بجوار المسجد",
    "label": "المنزل",
    "isDefault": true
  }
}
```

### PUT Update Customer

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/customers/{id}` |
| **Auth** | ✅ Admin, CallCenter |

**Request:**
```json
{
  "name": "محمد أحمد محدث",
  "phone": "0501234567",
  "phone2": null,
  "whatsappNumber": "0501234567",
  "serviceStatus": "active",
  "notes": "ملاحظات جديدة",
  "isActive": true
}
```

### POST Add Address

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/customers/{id}/addresses` |
| **Auth** | ✅ Admin, CallCenter |

**Request:**
```json
{
  "areaId": 2,
  "addressDetails": "شارع العليا، مبنى رقم 5",
  "label": "العمل",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "addressId": 2,
    "areaId": 2,
    "areaName": "حي العليا",
    "addressDetails": "شارع العليا، مبنى رقم 5",
    "label": "العمل",
    "isDefault": false,
    "deliveryCost": 40.00
  }
}
```

### GET Customer Orders

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/customers/{id}/orders` |
| **Auth** | ✅ Admin, CallCenter |

---

## 3.2 Orders

### GET All Orders (Paginated + Filters)

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/orders` |
| **Auth** | ✅ All Roles |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | DateTime? | Filter by delivery date |
| `eidDayId` | int? | Filter by Eid day |
| `periodId` | int? | Filter by period |
| `status` | string? | `pending`, `confirmed`, `preparing`, `ready`, `delivered`, `cancelled` |
| `paymentStatus` | string? | `unpaid`, `partial`, `paid` |
| `customerId` | int? | Filter by customer |
| `page` | int | Page number (default: 1) |
| `pageSize` | int | Items per page (default: 20) |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "orderId": 1,
        "orderNumber": "ORD-000100",
        "customerName": "محمد أحمد",
        "customerPhone": "0501234567",
        "periodName": "الفترة الصباحية",
        "deliveryDate": "2024-06-17",
        "totalCost": 1550.00,
        "remainingAmount": 550.00,
        "paymentStatus": "partial",
        "status": "confirmed",
        "itemCount": 2,
        "createdAt": "2024-02-01T10:30:00"
      }
    ],
    "totalCount": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

### GET Today's Orders

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/orders/today` |
| **Auth** | ✅ All Roles |

### GET Orders by Period

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/orders/by-period/{periodId}` |
| **Auth** | ✅ All Roles |

### GET Order by ID (Full Details)

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/orders/{id}` |
| **Auth** | ✅ All Roles |

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": 1,
    "orderNumber": "ORD-000100",
    "customer": {
      "customerId": 1,
      "name": "محمد أحمد",
      "phone": "0501234567"
    },
    "address": {
      "addressId": 1,
      "areaId": 1,
      "areaName": "حي النزهة",
      "addressDetails": "شارع الملك فهد",
      "label": "المنزل",
      "isDefault": true,
      "deliveryCost": 50.00
    },
    "period": {
      "eidDayPeriodId": 1,
      "eidDayId": 1,
      "eidDayName": "اليوم الأول",
      "eidDayDate": "2024-06-17T00:00:00",
      "periodId": 1,
      "periodName": "الفترة الصباحية",
      "categoryName": "أغنام",
      "startTime": "06:00:00",
      "endTime": "10:00:00",
      "maxCapacity": 12,
      "currentOrders": 5,
      "availableAmount": 7,
      "isActive": true,
      "isFull": false
    },
    "deliveryDate": "2024-06-17",
    "deliveryTime": "08:00:00",
    "subtotal": 1500.00,
    "deliveryCost": 50.00,
    "totalCost": 1550.00,
    "paidAmount": 1000.00,
    "remainingAmount": 550.00,
    "paymentStatus": "partial",
    "status": "confirmed",
    "notes": "يرجى التسليم باكراً",
    "createdBy": "admin",
    "createdAt": "2024-02-01T10:30:00",
    "items": [
      {
        "orderItemId": 1,
        "productPriceId": 1,
        "productName": "خروف كامل",
        "sizeName": "صغير",
        "portionName": null,
        "plateTypeId": 1,
        "plateTypeName": "صحن كبير",
        "quantity": 1,
        "unitPrice": 1500.00,
        "totalPrice": 1500.00,
        "notes": null
      }
    ],
    "payments": [
      {
        "paymentId": 1,
        "amount": 1000.00,
        "paymentMethod": "cash",
        "isRefund": false,
        "notes": "دفعة أولى",
        "createdBy": "admin",
        "createdAt": "2024-02-01T10:30:00"
      }
    ]
  }
}
```

### GET Order by Number

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/orders/by-number/{orderNumber}` |
| **Auth** | ✅ All Roles |

### POST Create Order

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/orders` |
| **Auth** | ✅ Admin, CallCenter |

**Request:**
```json
{
  "customerId": 1,
  "addressId": 1,
  "eidDayPeriodId": 1,
  "deliveryDate": "2024-06-17",
  "deliveryTime": "08:00:00",
  "paidAmount": 1000.00,
  "notes": "يرجى التسليم باكراً",
  "items": [
    {
      "productPriceId": 1,
      "plateTypeId": 1,
      "quantity": 1,
      "notes": null
    },
    {
      "productPriceId": 3,
      "plateTypeId": null,
      "quantity": 2,
      "notes": "بدون بصل"
    }
  ]
}
```

> ⚠️ `addressId = null` means pickup from store (استلام من الفرن)

### PUT Update Order

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/orders/{id}` |
| **Auth** | ✅ Admin |

**Request:**
```json
{
  "addressId": 2,
  "eidDayPeriodId": 3,
  "deliveryDate": "2024-06-18",
  "deliveryTime": "10:00:00",
  "notes": "ملاحظات محدثة"
}
```

### PATCH Update Order Status

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/orders/{id}/status` |
| **Auth** | ✅ All Roles |

**Request:**
```json
{
  "status": "confirmed"
}
```

> **Status flow:** `pending` → `confirmed` → `preparing` → `ready` → `delivered`
> Can also be `cancelled` from any status.

### POST Cancel Order

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/orders/{id}/cancel` |
| **Auth** | ✅ All Roles |

---

## 3.3 Order Payments

### POST Add Payment

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/orders/{id}/payments` |
| **Auth** | ✅ Admin, CallCenter |

**Request:**
```json
{
  "amount": 500.00,
  "paymentMethod": "cash",
  "isRefund": false,
  "notes": "دفعة ثانية"
}
```

> **paymentMethod values:** `"cash"`, `"bank_transfer"`, `"card"`

---

# Phase 4: Users Management

> **Priority:** 🟢 Medium
> Admin-only user management.

---

## 4.1 Users (Admin Only)

### GET All Users

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/users` |
| **Auth** | 🔒 Admin Only |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": 1,
      "username": "admin",
      "fullName": "مدير النظام",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00"
    }
  ]
}
```

### GET User by ID

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/users/{id}` |
| **Auth** | 🔒 Admin Only |

### POST Create User

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/users` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "username": "operator1",
  "password": "Pass@123",
  "fullName": "أحمد علي",
  "role": "call_center"
}
```

> **Role values:** `"admin"`, `"call_center"`, `"order_reviewer"`

### PUT Update User

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/users/{id}` |
| **Auth** | 🔒 Admin Only |

**Request:**
```json
{
  "fullName": "أحمد علي محدث",
  "role": "call_center",
  "isActive": true
}
```

### DELETE User (Soft Delete)

| | |
|---|---|
| **Method** | `DELETE` |
| **URL** | `/api/users/{id}` |
| **Auth** | 🔒 Admin Only |

### POST Reset Password

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/users/{id}/reset-password` |
| **Auth** | 🔒 Admin Only |

**Request:** (raw string in body)
```json
"NewPassword@123"
```

---

# Phase 5: Kitchen View

> **Priority:** 🟢 Medium
> Kitchen/Order Reviewer interface for managing order preparation.

---

## 5.1 Kitchen - Today's Orders

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/kitchen/today?periodId={optional}` |
| **Auth** | ✅ Admin, OrderReviewer |

**Response (no prices shown):**
```json
{
  "success": true,
  "data": [
    {
      "orderId": 1,
      "orderNumber": "ORD-000100",
      "customerName": "محمد أحمد",
      "customerPhone": "0501234567",
      "address": "حي النزهة - شارع الملك فهد",
      "period": "الفترة الصباحية",
      "deliveryTime": "08:00",
      "status": "confirmed",
      "notes": null,
      "items": [
        {
          "productName": "خروف كامل",
          "size": "صغير",
          "plateType": "صحن كبير",
          "quantity": 1,
          "notes": null
        }
      ]
    }
  ]
}
```

---

## 5.2 Kitchen - Product Summary

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/kitchen/summary?periodId={optional}&date={optional}` |
| **Auth** | ✅ Admin, OrderReviewer |

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "category": "أغنام",
        "product": "خروف كامل",
        "size": "صغير",
        "totalQuantity": 15
      }
    ],
    "plates": [
      {
        "plateType": "صحن كبير",
        "count": 10
      }
    ]
  }
}
```

---

## 5.3 Kitchen - Update Order Status

| | |
|---|---|
| **Method** | `PATCH` |
| **URL** | `/api/kitchen/orders/{id}/status` |
| **Auth** | ✅ Admin, OrderReviewer |

**Request:**
```json
{
  "status": "preparing"
}
```

> **Allowed statuses from Kitchen:** `"preparing"`, `"ready"`, `"delivered"`

---

## 5.4 Kitchen - Today's Periods

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/kitchen/periods-today` |
| **Auth** | ✅ Admin, OrderReviewer |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "eidDayPeriodId": 1,
      "periodName": "الفترة الصباحية",
      "startTime": "06:00:00",
      "endTime": "10:00:00",
      "orderCount": 8
    }
  ]
}
```

---

# Phase 6: Reports

> **Priority:** 🔵 Low-Medium
> All 7 reports as defined in business requirements.

---

## 6.1 Customer Invoice

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/reports/invoice/{orderId}` |
| **Auth** | ✅ All Roles |

**Response:** Full order details with items, prices, totals, payment info.

---

## 6.2 Kitchen Report

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/reports/kitchen?date={date}&periodId={optional}` |
| **Auth** | ✅ Admin, OrderReviewer |

**Response:** Products grouped by category with quantities and plate summary.

---

## 6.3 Management Report

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/reports/management?startDate={}&endDate={}` |
| **Auth** | 🔒 Admin Only |

**Response:** Orders by day and period, revenue by category.

---

## 6.4 Financial Report

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/reports/financial?startDate={}&endDate={}` |
| **Auth** | 🔒 Admin Only |

**Response:** Total revenue, paid, unpaid, by payment method and status.

---

## 6.5 Delivery Report

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/reports/delivery?date={date}&periodId={optional}` |
| **Auth** | 🔒 Admin Only |

**Response:** Orders grouped by area with customer and delivery info.

---

## 6.6 Delivery Invoice

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/reports/delivery-invoice/{orderId}` |
| **Auth** | ✅ All Roles |

**Response:** Same as customer invoice + checkbox for each item + reviewer name field.

---

## 6.7 Customers Info Report

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/reports/customers-info?startDate={}&endDate={}` |
| **Auth** | 🔒 Admin Only |

**Response:** Customer list with booking status, new/old, order count, total spent.

---

# Phase 7: Activity Logs

> **Priority:** ⚪ Low
> Admin audit trail.

---

## 7.1 GET All Logs (Paginated)

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/activitylogs?page=1&pageSize=20&entityType={}&userId={}&startDate={}&endDate={}` |
| **Auth** | 🔒 Admin Only |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "logId": 1,
        "userId": 1,
        "userName": "admin",
        "action": "create",
        "entityType": "orders",
        "entityId": 5,
        "ipAddress": "192.168.1.1",
        "createdAt": "2024-02-01T10:30:00"
      }
    ],
    "totalCount": 500,
    "page": 1,
    "pageSize": 20,
    "totalPages": 25,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## 7.2 GET Logs by Entity

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/activitylogs/entity/{entityType}/{entityId}` |
| **Auth** | 🔒 Admin Only |

## 7.3 GET Logs by User

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/activitylogs/user/{userId}` |
| **Auth** | 🔒 Admin Only |

---

# 📋 Quick Reference - All Phases Summary

| Phase | Module | Endpoints | Priority |
|-------|--------|-----------|----------|
| **1** | Auth + Dashboard | 6 endpoints | 🔴 Critical |
| **2** | Settings (Categories, Products, Prices, Sizes, Portions, PlateTypes, Areas, EidDays, Periods) | 30 endpoints | 🟠 High |
| **3** | Customers + Orders + Payments | 15 endpoints | 🟡 High |
| **4** | Users Management | 6 endpoints | 🟢 Medium |
| **5** | Kitchen View | 4 endpoints | 🟢 Medium |
| **6** | Reports (7 reports) | 7 endpoints | 🔵 Low-Medium |
| **7** | Activity Logs | 3 endpoints | ⚪ Low |
| | **Total** | **~71 endpoints** | |
