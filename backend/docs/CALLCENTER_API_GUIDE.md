# 📞 Call Center Dashboard - Complete API Guide

**Date:** February 8, 2026  
**Target Role:** `call_center`  
**Backend URL:** `https://localhost:7262/api`

---

## 🎯 Overview

This document contains **ALL endpoints** that a call center user needs to implement the dashboard frontend.

**What Call Center Users Can Do:**
- ✅ View dashboard statistics
- ✅ Create and manage orders
- ✅ Manage customers
- ✅ View products, categories, and areas
- ✅ Search customers by phone
- ✅ View order history

---

## 🔐 Authentication

All endpoints require authentication. See [FRONTEND_INSTRUCTIONS.md](FRONTEND_INSTRUCTIONS.md) for setup.

**Test Account:**
- Username: `user`
- Password: `user1234`
- Role: `call_center`

---

## 📊 1. Dashboard Endpoints

### 1.1. Get Dashboard Statistics

**Get overview statistics for the dashboard.**

```http
GET /api/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": {
    "totalOrders": 150,
    "todayOrders": 12,
    "pendingOrders": 25,
    "preparingOrders": 10,
    "deliveredOrders": 115,
    "totalRevenue": 45000.00,
    "todayRevenue": 3500.00,
    "unpaidAmount": 5000.00,
    "totalCustomers": 85,
    "newCustomersToday": 3
  }
}
```

**Frontend Example:**
```typescript
async function getDashboardStats() {
  const response = await api.get('/dashboard/stats');
  return response.data.data;
}
```

---

### 1.2. Get Period Availability

**Get availability for all Eid day periods (capacity tracking).**

```http
GET /api/dashboard/period-availability
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "eidDayPeriodId": 1,
      "dayName": "أول أيام العيد",
      "periodName": "الفترة الصباحية",
      "available": 45,
      "total": 100,
      "isFull": false
    },
    {
      "eidDayPeriodId": 2,
      "dayName": "أول أيام العيد",
      "periodName": "الفترة المسائية",
      "available": 0,
      "total": 80,
      "isFull": true
    }
  ]
}
```

**Frontend Example:**
```typescript
async function getPeriodAvailability() {
  const response = await api.get('/dashboard/period-availability');
  return response.data.data;
}
```

---

## 🛒 2. Orders Endpoints

### 2.1. Get All Orders (Paginated)

**Get paginated list of orders with optional filters.**

```http
GET /api/orders?page=1&pageSize=20&status=pending&date=2026-02-08
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 20)
- `date` (optional): Filter by delivery date (format: YYYY-MM-DD)
- `status` (optional): Filter by status (pending, preparing, ready, delivered, cancelled)
- `paymentStatus` (optional): Filter by payment status (paid, partial, unpaid)
- `customerId` (optional): Filter by customer ID

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": {
    "items": [
      {
        "orderId": 123,
        "orderNumber": "EID-2026-00123",
        "customerName": "أحمد محمد",
        "customerPhone": "0501234567",
        "periodName": "الفترة الصباحية",
        "deliveryDate": "2026-02-10T00:00:00",
        "totalCost": 450.00,
        "remainingAmount": 150.00,
        "paymentStatus": "partial",
        "status": "pending",
        "itemCount": 3,
        "createdAt": "2026-02-08T10:30:00"
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

**Frontend Example:**
```typescript
async function getOrders(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await api.get(`/orders?${params}`);
  return response.data.data;
}

// Usage:
const result = await getOrders({ 
  page: 1, 
  pageSize: 20, 
  status: 'pending' 
});
```

---

### 2.2. Get Today's Orders

**Get all orders for today (no pagination).**

```http
GET /api/orders/today
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "orderId": 123,
      "orderNumber": "EID-2026-00123",
      "customerName": "أحمد محمد",
      "customerPhone": "0501234567",
      "periodName": "الفترة الصباحية",
      "deliveryDate": "2026-02-08T00:00:00",
      "totalCost": 450.00,
      "remainingAmount": 150.00,
      "paymentStatus": "partial",
      "status": "pending",
      "itemCount": 3,
      "createdAt": "2026-02-08T10:30:00"
    }
  ]
}
```

**Frontend Example:**
```typescript
async function getTodayOrders() {
  const response = await api.get('/orders/today');
  return response.data.data;
}
```

---

### 2.3. Get Orders by Period

**Get all orders for a specific Eid day period.**

```http
GET /api/orders/by-period/{periodId}
```

**Path Parameters:**
- `periodId`: Eid day period ID

**Response:** Same as "Today's Orders"

**Frontend Example:**
```typescript
async function getOrdersByPeriod(periodId) {
  const response = await api.get(`/orders/by-period/${periodId}`);
  return response.data.data;
}
```

---

### 2.4. Get Order by ID

**Get full details of a specific order.**

```http
GET /api/orders/{id}
```

**Path Parameters:**
- `id`: Order ID

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": {
    "orderId": 123,
    "orderNumber": "EID-2026-00123",
    "customer": {
      "customerId": 45,
      "name": "أحمد محمد",
      "phone": "0501234567"
    },
    "address": {
      "addressId": 12,
      "areaId": 5,
      "areaName": "الصفا",
      "addressDetails": "شارع الملك عبدالعزيز، بناية 15",
      "label": "المنزل",
      "isDefault": true,
      "deliveryCost": 20.00
    },
    "period": {
      "eidDayPeriodId": 1,
      "eidDayId": 1,
      "eidDayName": "أول أيام العيد",
      "eidDayDate": "2026-02-10T00:00:00",
      "periodId": 1,
      "periodName": "الفترة الصباحية",
      "categoryName": "الذبائح",
      "startTime": "08:00:00",
      "endTime": "12:00:00",
      "maxCapacity": 100,
      "currentOrders": 55,
      "availableAmount": 45,
      "isActive": true,
      "isFull": false
    },
    "deliveryDate": "2026-02-10T00:00:00",
    "deliveryTime": "10:00:00",
    "subtotal": 430.00,
    "deliveryCost": 20.00,
    "totalCost": 450.00,
    "paidAmount": 300.00,
    "remainingAmount": 150.00,
    "paymentStatus": "partial",
    "status": "pending",
    "notes": "يرجى الاتصال قبل التوصيل",
    "createdBy": "user",
    "createdAt": "2026-02-08T10:30:00",
    "items": [
      {
        "orderItemId": 301,
        "productPriceId": 15,
        "productName": "خروف كامل",
        "sizeName": "كبير",
        "portionName": "كامل",
        "plateTypeId": 1,
        "plateTypeName": "مستطيل",
        "quantity": 1,
        "unitPrice": 350.00,
        "totalPrice": 350.00,
        "notes": null
      },
      {
        "orderItemId": 302,
        "productPriceId": 8,
        "productName": "دجاج مشوي",
        "sizeName": null,
        "portionName": "كامل",
        "plateTypeId": 2,
        "plateTypeName": "دائري",
        "quantity": 2,
        "unitPrice": 40.00,
        "totalPrice": 80.00,
        "notes": null
      }
    ],
    "payments": [
      {
        "paymentId": 201,
        "amount": 300.00,
        "paymentMethod": "cash",
        "isRefund": false,
        "notes": null,
        "createdBy": "user",
        "createdAt": "2026-02-08T10:35:00"
      }
    ]
  }
}
```

**Frontend Example:**
```typescript
async function getOrderById(orderId) {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.data;
}
```

---

### 2.5. Get Order by Order Number

**Search for an order by its order number.**

```http
GET /api/orders/by-number/{orderNumber}
```

**Path Parameters:**
- `orderNumber`: Order number (e.g., EID-2026-00123)

**Response:** Same as "Get Order by ID"

**Frontend Example:**
```typescript
async function getOrderByNumber(orderNumber) {
  const response = await api.get(`/orders/by-number/${orderNumber}`);
  return response.data.data;
}
```

---

### 2.6. Create Order

**Create a new order.**

```http
POST /api/orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerId": 45,
  "addressId": 12,
  "eidDayPeriodId": 1,
  "deliveryDate": "2026-02-10T00:00:00",
  "deliveryTime": "10:00:00",
  "paidAmount": 300.00,
  "notes": "يرجى الاتصال قبل التوصيل",
  "items": [
    {
      "productPriceId": 15,
      "plateTypeId": 1,
      "quantity": 1,
      "notes": null
    },
    {
      "productPriceId": 8,
      "plateTypeId": 2,
      "quantity": 2,
      "notes": null
    }
  ]
}
```

**Request Fields:**
- `customerId` (required): Customer ID
- `addressId` (optional): Customer address ID (if null, uses default address)
- `eidDayPeriodId` (required): Eid day period ID
- `deliveryDate` (optional): Delivery date
- `deliveryTime` (optional): Delivery time
- `paidAmount` (optional): Initial payment amount (default: 0)
- `notes` (optional): Order notes
- `items` (required): Array of order items
  - `productPriceId` (required): Product price ID
  - `plateTypeId` (optional): Plate type ID (if product requires plate selection)
  - `quantity` (required): Quantity
  - `notes` (optional): Item notes

**Response:** Same as "Get Order by ID"

**Frontend Example:**
```typescript
async function createOrder(orderData) {
  const response = await api.post('/orders', orderData);
  return response.data;
}

// Usage:
const newOrder = await createOrder({
  customerId: 45,
  addressId: 12,
  eidDayPeriodId: 1,
  deliveryDate: '2026-02-10T00:00:00',
  deliveryTime: '10:00:00',
  paidAmount: 300,
  notes: 'يرجى الاتصال قبل التوصيل',
  items: [
    {
      productPriceId: 15,
      plateTypeId: 1,
      quantity: 1
    }
  ]
});
```

---

### 2.7. Update Order

**Update an existing order.**

```http
PUT /api/orders/{id}
Content-Type: application/json
```

**Path Parameters:**
- `id`: Order ID

**Request Body:**
```json
{
  "addressId": 12,
  "eidDayPeriodId": 2,
  "deliveryDate": "2026-02-10T00:00:00",
  "deliveryTime": "14:00:00",
  "notes": "تم تعديل موعد التوصيل"
}
```

**Request Fields (All Optional):**
- `addressId`: New address ID
- `eidDayPeriodId`: New period ID
- `deliveryDate`: New delivery date
- `deliveryTime`: New delivery time
- `notes`: Updated notes

**Response:** Same as "Get Order by ID"

**Frontend Example:**
```typescript
async function updateOrder(orderId, updates) {
  const response = await api.put(`/orders/${orderId}`, updates);
  return response.data;
}
```

---

### 2.8. Update Order Status

**Update the status of an order.**

```http
PATCH /api/orders/{id}/status
Content-Type: application/json
```

**Path Parameters:**
- `id`: Order ID

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Valid Status Values:**
- `pending` - قيد الانتظار
- `preparing` - قيد التحضير
- `ready` - جاهز للتوصيل
- `delivering` - قيد التوصيل
- `delivered` - تم التوصيل
- `cancelled` - ملغي

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث حالة الطلب",
  "data": null
}
```

**Frontend Example:**
```typescript
async function updateOrderStatus(orderId, status) {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
}
```

---

### 2.9. Cancel Order

**Cancel an order.**

```http
POST /api/orders/{id}/cancel
```

**Path Parameters:**
- `id`: Order ID

**Response:**
```json
{
  "success": true,
  "message": "تم إلغاء الطلب",
  "data": null
}
```

**Frontend Example:**
```typescript
async function cancelOrder(orderId) {
  const response = await api.post(`/orders/${orderId}/cancel`);
  return response.data;
}
```

---

### 2.10. Add Payment to Order

**Add a payment record to an order.**

```http
POST /api/orders/{id}/payments
Content-Type: application/json
```

**Path Parameters:**
- `id`: Order ID

**Request Body:**
```json
{
  "amount": 150.00,
  "paymentMethod": "cash",
  "isRefund": false,
  "notes": "دفعة نهائية"
}
```

**Request Fields:**
- `amount` (required): Payment amount
- `paymentMethod` (optional): Payment method (default: "cash")
  - Valid values: `cash`, `card`, `bank_transfer`, `online`
- `isRefund` (optional): Is this a refund? (default: false)
- `notes` (optional): Payment notes

**Response:**
```json
{
  "success": true,
  "message": "تم إضافة الدفعة بنجاح",
  "data": {
    "paymentId": 202,
    "amount": 150.00,
    "paymentMethod": "cash",
    "isRefund": false,
    "notes": "دفعة نهائية",
    "createdBy": "user",
    "createdAt": "2026-02-08T15:20:00"
  }
}
```

**Frontend Example:**
```typescript
async function addPayment(orderId, paymentData) {
  const response = await api.post(`/orders/${orderId}/payments`, paymentData);
  return response.data;
}
```

---

## 👥 3. Customers Endpoints

### 3.1. Get All Customers

**Get list of all customers.**

```http
GET /api/customers
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "customerId": 45,
      "name": "أحمد محمد",
      "phone": "0501234567",
      "phone2": "0559876543",
      "whatsappNumber": "0501234567",
      "serviceStatus": "active",
      "notes": "عميل مميز",
      "isActive": true,
      "isNewCustomer": false,
      "orderCount": 5,
      "createdAt": "2025-12-15T10:00:00",
      "addresses": [
        {
          "addressId": 12,
          "areaId": 5,
          "areaName": "الصفا",
          "addressDetails": "شارع الملك عبدالعزيز، بناية 15",
          "label": "المنزل",
          "isDefault": true,
          "deliveryCost": 20.00
        }
      ]
    }
  ]
}
```

**Frontend Example:**
```typescript
async function getAllCustomers() {
  const response = await api.get('/customers');
  return response.data.data;
}
```

---

### 3.2. Search Customer by Phone

**Search for a customer by phone number.**

```http
GET /api/customers/search?phone=0501234567
```

**Query Parameters:**
- `phone` (required): Phone number to search for

**Response:** Same as single customer object (or null if not found)

```json
{
  "success": true,
  "message": "لا يوجد عميل بهذا الرقم",
  "data": null
}
```

Or if found:

```json
{
  "success": true,
  "message": null,
  "data": {
    "customerId": 45,
    "name": "أحمد محمد",
    "phone": "0501234567",
    ...
  }
}
```

**Frontend Example:**
```typescript
async function searchCustomerByPhone(phone) {
  const response = await api.get(`/customers/search?phone=${phone}`);
  return response.data.data; // null if not found
}
```

---

### 3.3. Get Customer by ID

**Get full details of a specific customer.**

```http
GET /api/customers/{id}
```

**Path Parameters:**
- `id`: Customer ID

**Response:** Same as customer object in "Get All Customers"

**Frontend Example:**
```typescript
async function getCustomerById(customerId) {
  const response = await api.get(`/customers/${customerId}`);
  return response.data.data;
}
```

---

### 3.4. Create Customer

**Create a new customer.**

```http
POST /api/customers
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "أحمد محمد",
  "phone": "0501234567",
  "phone2": "0559876543",
  "whatsappNumber": "0501234567",
  "notes": "عميل جديد",
  "address": {
    "areaId": 5,
    "addressDetails": "شارع الملك عبدالعزيز، بناية 15",
    "label": "المنزل",
    "isDefault": true
  }
}
```

**Request Fields:**
- `name` (required): Customer name
- `phone` (required): Primary phone number
- `phone2` (optional): Secondary phone number
- `whatsappNumber` (optional): WhatsApp number
- `notes` (optional): Customer notes
- `address` (optional): Initial address
  - `areaId` (required): Area ID
  - `addressDetails` (required): Full address details
  - `label` (optional): Address label (e.g., "المنزل", "العمل")
  - `isDefault` (optional): Is this the default address? (default: false)

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء العميل بنجاح",
  "data": {
    "customerId": 46,
    "name": "أحمد محمد",
    ...
  }
}
```

**Frontend Example:**
```typescript
async function createCustomer(customerData) {
  const response = await api.post('/customers', customerData);
  return response.data;
}
```

---

### 3.5. Update Customer

**Update an existing customer.**

```http
PUT /api/customers/{id}
Content-Type: application/json
```

**Path Parameters:**
- `id`: Customer ID

**Request Body (All fields optional):**
```json
{
  "name": "أحمد محمد السعيد",
  "phone": "0501234567",
  "phone2": "0559876543",
  "whatsappNumber": "0501234567",
  "serviceStatus": "active",
  "notes": "عميل مميز - تحديث",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث العميل بنجاح",
  "data": {
    "customerId": 45,
    ...
  }
}
```

**Frontend Example:**
```typescript
async function updateCustomer(customerId, updates) {
  const response = await api.put(`/customers/${customerId}`, updates);
  return response.data;
}
```

---

### 3.6. Add Address to Customer

**Add a new address to an existing customer.**

```http
POST /api/customers/{id}/addresses
Content-Type: application/json
```

**Path Parameters:**
- `id`: Customer ID

**Request Body:**
```json
{
  "areaId": 7,
  "addressDetails": "شارع التحلية، مجمع الجوهرة",
  "label": "العمل",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إضافة العنوان بنجاح",
  "data": {
    "addressId": 13,
    "areaId": 7,
    "areaName": "النعيم",
    "addressDetails": "شارع التحلية، مجمع الجوهرة",
    "label": "العمل",
    "isDefault": false,
    "deliveryCost": 15.00
  }
}
```

**Frontend Example:**
```typescript
async function addCustomerAddress(customerId, addressData) {
  const response = await api.post(
    `/customers/${customerId}/addresses`, 
    addressData
  );
  return response.data;
}
```

---

### 3.7. Get Customer Orders

**Get all orders for a specific customer.**

```http
GET /api/customers/{id}/orders
```

**Path Parameters:**
- `id`: Customer ID

**Response:** Array of orders (same format as order list)

**Frontend Example:**
```typescript
async function getCustomerOrders(customerId) {
  const response = await api.get(`/customers/${customerId}/orders`);
  return response.data.data;
}
```

---

## 📦 4. Products Endpoints

### 4.1. Get All Products

**Get all active products (optionally filter by category).**

```http
GET /api/products
GET /api/products?categoryId=1
```

**Query Parameters:**
- `categoryId` (optional): Filter by category ID

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "productId": 10,
      "categoryId": 1,
      "categoryName": "الذبائح",
      "nameAr": "خروف كامل",
      "nameEn": "Whole Lamb",
      "description": "خروف طازج عالي الجودة",
      "plateOption": "required",
      "isActive": true,
      "sortOrder": 1,
      "prices": [
        {
          "productPriceId": 15,
          "sizeId": 2,
          "sizeName": "كبير",
          "portionId": 1,
          "portionName": "كامل",
          "price": 350.00,
          "isActive": true
        },
        {
          "productPriceId": 16,
          "sizeId": 1,
          "sizeName": "وسط",
          "portionId": 1,
          "portionName": "كامل",
          "price": 280.00,
          "isActive": true
        }
      ],
      "plateTypes": [
        {
          "plateTypeId": 1,
          "nameAr": "مستطيل",
          "nameEn": "Rectangle",
          "isActive": true,
          "sortOrder": 1
        },
        {
          "plateTypeId": 2,
          "nameAr": "طولي جديد",
          "nameEn": "New Long",
          "isActive": true,
          "sortOrder": 2
        }
      ]
    }
  ]
}
```

**Frontend Example:**
```typescript
async function getAllProducts(categoryId = null) {
  const url = categoryId 
    ? `/products?categoryId=${categoryId}` 
    : '/products';
  const response = await api.get(url);
  return response.data.data;
}
```

---

### 4.2. Get Product by ID

**Get details of a specific product.**

```http
GET /api/products/{id}
```

**Path Parameters:**
- `id`: Product ID

**Response:** Single product object (same format as product in list)

**Frontend Example:**
```typescript
async function getProductById(productId) {
  const response = await api.get(`/products/${productId}`);
  return response.data.data;
}
```

---

### 4.3. Get Product Sizes

**Get all available product sizes.**

```http
GET /api/products/sizes
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "sizeId": 1,
      "nameAr": "وسط",
      "nameEn": "Medium",
      "isActive": true,
      "sortOrder": 1
    },
    {
      "sizeId": 2,
      "nameAr": "كبير",
      "nameEn": "Large",
      "isActive": true,
      "sortOrder": 2
    }
  ]
}
```

**Frontend Example:**
```typescript
async function getProductSizes() {
  const response = await api.get('/products/sizes');
  return response.data.data;
}
```

---

### 4.4. Get Product Portions

**Get all available product portions.**

```http
GET /api/products/portions
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "portionId": 1,
      "nameAr": "كامل",
      "nameEn": "Full",
      "multiplier": 1.00,
      "isActive": true,
      "sortOrder": 1
    },
    {
      "portionId": 2,
      "nameAr": "نصف",
      "nameEn": "Half",
      "multiplier": 0.50,
      "isActive": true,
      "sortOrder": 2
    }
  ]
}
```

**Frontend Example:**
```typescript
async function getProductPortions() {
  const response = await api.get('/products/portions');
  return response.data.data;
}
```

---

### 4.5. Get Plate Types

**Get all available plate types.**

```http
GET /api/products/plate-types
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "plateTypeId": 1,
      "nameAr": "مستطيل",
      "nameEn": "Rectangle",
      "isActive": true,
      "sortOrder": 1
    },
    {
      "plateTypeId": 2,
      "nameAr": "طولي جديد",
      "nameEn": "New Long",
      "isActive": true,
      "sortOrder": 2
    },
    {
      "plateTypeId": 3,
      "nameAr": "دائري",
      "nameEn": "Circular",
      "isActive": true,
      "sortOrder": 3
    }
  ]
}
```

**Frontend Example:**
```typescript
async function getPlateTypes() {
  const response = await api.get('/products/plate-types');
  return response.data.data;
}
```

---

## 📂 5. Categories Endpoints

### 5.1. Get All Categories

**Get all active categories.**

```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "categoryId": 1,
      "nameAr": "الذبائح",
      "nameEn": "Sacrifices",
      "description": "ذبائح طازجة عالية الجودة",
      "isActive": true,
      "sortOrder": 1,
      "productCount": 15
    },
    {
      "categoryId": 2,
      "nameAr": "منتجات الدجاج واللحم",
      "nameEn": "Chicken & Meat Products",
      "description": null,
      "isActive": true,
      "sortOrder": 2,
      "productCount": 8
    }
  ]
}
```

**Frontend Example:**
```typescript
async function getCategories() {
  const response = await api.get('/categories');
  return response.data.data;
}
```

---

### 5.2. Get Category by ID

**Get details of a specific category.**

```http
GET /api/categories/{id}
```

**Response:** Single category object

**Frontend Example:**
```typescript
async function getCategoryById(categoryId) {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data.data;
}
```

---

## 📍 6. Areas Endpoints

### 6.1. Get All Delivery Areas

**Get all active delivery areas.**

```http
GET /api/areas
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": [
    {
      "areaId": 1,
      "nameAr": "ابحر الجنوبية",
      "nameEn": "Obhur South",
      "deliveryCost": 0.00,
      "isActive": true,
      "sortOrder": 1
    },
    {
      "areaId": 2,
      "nameAr": "ابحر الشمالية",
      "nameEn": "Obhur North",
      "deliveryCost": 0.00,
      "isActive": true,
      "sortOrder": 2
    },
    {
      "areaId": 5,
      "nameAr": "الصفا",
      "nameEn": "As Safa",
      "deliveryCost": 20.00,
      "isActive": true,
      "sortOrder": 4
    }
  ]
}
```

**Frontend Example:**
```typescript
async function getAreas() {
  const response = await api.get('/areas');
  return response.data.data;
}
```

---

## 🔐 7. Authentication Endpoints

### 7.1. Login

**Already documented.** See [FRONTEND_INSTRUCTIONS.md](FRONTEND_INSTRUCTIONS.md)

```http
POST /api/auth/login
```

---

### 7.2. Logout

**Already documented.** See [FRONTEND_INSTRUCTIONS.md](FRONTEND_INSTRUCTIONS.md)

```http
POST /api/auth/logout
```

---

### 7.3. Get Current User

**Get authenticated user information.**

```http
GET /api/auth/me
```

**Response:**
```json
{
  "success": true,
  "message": null,
  "data": {
    "userId": 2,
    "username": "user",
    "fullName": "موظف مركز الاتصال",
    "role": "call_center",
    "isActive": true,
    "createdAt": "2026-02-08T10:00:00"
  }
}
```

**Frontend Example:**
```typescript
async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data.data;
}
```

---

### 7.4. Change Password

**Change current user's password.**

```http
POST /api/auth/change-password
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "user1234",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح",
  "data": null
}
```

**Frontend Example:**
```typescript
async function changePassword(currentPassword, newPassword) {
  const response = await api.post('/auth/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
}
```

---

## 📋 8. Complete TypeScript API Service

Here's a complete API service module for your frontend:

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7262/api',
  withCredentials: true
});

// Interceptor for 401 handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const authService = {
  async login(username: string, password: string) {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    return response.data.data.user;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

// Dashboard
export const dashboardService = {
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  async getPeriodAvailability() {
    const response = await api.get('/dashboard/period-availability');
    return response.data.data;
  }
};

// Orders
export const orderService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/orders?${params}`);
    return response.data.data;
  },

  async getToday() {
    const response = await api.get('/orders/today');
    return response.data.data;
  },

  async getByPeriod(periodId: number) {
    const response = await api.get(`/orders/by-period/${periodId}`);
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  async getByNumber(orderNumber: string) {
    const response = await api.get(`/orders/by-number/${orderNumber}`);
    return response.data.data;
  },

  async create(orderData: any) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async update(id: number, updates: any) {
    const response = await api.put(`/orders/${id}`, updates);
    return response.data;
  },

  async updateStatus(id: number, status: string) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  async cancel(id: number) {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },

  async addPayment(id: number, paymentData: any) {
    const response = await api.post(`/orders/${id}/payments`, paymentData);
    return response.data;
  }
};

// Customers
export const customerService = {
  async getAll() {
    const response = await api.get('/customers');
    return response.data.data;
  },

  async searchByPhone(phone: string) {
    const response = await api.get(`/customers/search?phone=${phone}`);
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
  },

  async create(customerData: any) {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  async update(id: number, updates: any) {
    const response = await api.put(`/customers/${id}`, updates);
    return response.data;
  },

  async addAddress(id: number, addressData: any) {
    const response = await api.post(`/customers/${id}/addresses`, addressData);
    return response.data;
  },

  async getOrders(id: number) {
    const response = await api.get(`/customers/${id}/orders`);
    return response.data.data;
  }
};

// Products
export const productService = {
  async getAll(categoryId?: number) {
    const url = categoryId ? `/products?categoryId=${categoryId}` : '/products';
    const response = await api.get(url);
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  async getSizes() {
    const response = await api.get('/products/sizes');
    return response.data.data;
  },

  async getPortions() {
    const response = await api.get('/products/portions');
    return response.data.data;
  },

  async getPlateTypes() {
    const response = await api.get('/products/plate-types');
    return response.data.data;
  }
};

// Categories
export const categoryService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  }
};

// Areas
export const areaService = {
  async getAll() {
    const response = await api.get('/areas');
    return response.data.data;
  }
};

export default api;
```

---

## 🎯 9. Quick Start Checklist

- [ ] Setup axios with `withCredentials: true`
- [ ] Implement login/logout
- [ ] Create dashboard page (stats + period availability)
- [ ] Create orders page (list orders)
- [ ] Create order detail page
- [ ] Create order creation page
- [ ] Implement customer search
- [ ] Create customer management
- [ ] Display products by category
- [ ] Implement order status updates
- [ ] Implement payment recording

---

## 📞 Support

**Test Account:**
- Username: `user`
- Password: `user1234`
- Role: `call_center`

**Backend URL:** `https://localhost:7262/api`

**Documentation:**
- [FRONTEND_INSTRUCTIONS.md](FRONTEND_INSTRUCTIONS.md) - Setup guide
- [USER_ROLES.md](USER_ROLES.md) - Role permissions
- [COOKIE_401_TROUBLESHOOTING.md](COOKIE_401_TROUBLESHOOTING.md) - Fix 401 errors

---

**Total Endpoints for Call Center:** 37 endpoints ✅

Good luck with the implementation! 🚀
