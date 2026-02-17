# 👥 User Roles & Permissions

**Date:** February 8, 2026

---

## 🎯 Available Roles

The EidSystem backend has **3 defined user roles**:

### 1. `admin` - Administrator
**Full system access** - Can manage everything

**Typical permissions:**
- Create, read, update, delete all entities
- Manage users (create, update, delete)
- Manage categories, products, areas
- Manage orders
- View dashboard and analytics
- Access all endpoints

**Test account:**
- Username: `admin`
- Password: `admin1234`

---

### 2. `call_center` - Call Center Staff
**Default role for normal users** - Can manage orders and customers

**Typical permissions:**
- Create and manage orders
- Manage customers
- View products and categories
- View available delivery areas
- Update order status
- Limited dashboard access

**Test account:**
- Username: `user`
- Password: `user1234`

---

### 3. `order_reviewer` - Order Reviewer
**Review and approve orders** - Quality control role

**Typical permissions:**
- View all orders
- Review order details
- Approve/reject orders
- View customer information
- Read-only access to products
- Limited dashboard access

**Test account:** *(Not seeded - create manually if needed)*

---

## 📝 User Entity

From `User.cs`:

```csharp
public class User
{
    public int UserId { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; } = "call_center";  // Default role
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

**Default role:** `call_center`

---

## 🔐 Role in Authentication

When a user logs in, their role is included in the JWT token and returned in the login response:

```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "userId": 1,
      "username": "admin",
      "fullName": "مدير النظام",
      "role": "admin",        // ← Role is here
      "isActive": true,
      "createdAt": "2026-02-08T..."
    }
  }
}
```

The frontend can use the role to:
- Show/hide UI elements based on permissions
- Determine which routes/pages to display
- Customize user experience

---

## 🎨 Frontend Role Usage

### Example 1: Conditional Rendering

```typescript
const user = JSON.parse(localStorage.getItem('user'));

{user.role === 'admin' && (
  <AdminPanel />
)}

{user.role === 'call_center' && (
  <OrderManagement />
)}

{user.role === 'order_reviewer' && (
  <OrderReview />
)}
```

### Example 2: Route Guards

```typescript
function ProtectedRoute({ allowedRoles, children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}

// Usage:
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>

<ProtectedRoute allowedRoles={['admin', 'call_center']}>
  <OrdersPage />
</ProtectedRoute>
```

### Example 3: Menu Items

```typescript
const menuItems = [
  { 
    label: 'Dashboard', 
    path: '/dashboard', 
    roles: ['admin', 'call_center', 'order_reviewer'] 
  },
  { 
    label: 'Users', 
    path: '/users', 
    roles: ['admin']  // Admin only
  },
  { 
    label: 'Orders', 
    path: '/orders', 
    roles: ['admin', 'call_center', 'order_reviewer'] 
  },
  { 
    label: 'Products', 
    path: '/products', 
    roles: ['admin', 'call_center'] 
  }
];

// Filter menu based on user role
const user = JSON.parse(localStorage.getItem('user'));
const filteredMenu = menuItems.filter(item => 
  item.roles.includes(user.role)
);
```

---

## 👨‍💼 Creating Users with Different Roles

### Create Admin User

```typescript
await api.post('/users', {
  username: 'admin2',
  password: 'securePassword123',
  fullName: 'Second Admin',
  role: 'admin'
});
```

### Create Call Center User

```typescript
await api.post('/users', {
  username: 'callcenter1',
  password: 'securePassword123',
  fullName: 'موظف مركز الاتصال 1',
  role: 'call_center'
});
```

### Create Order Reviewer

```typescript
await api.post('/users', {
  username: 'reviewer1',
  password: 'securePassword123',
  fullName: 'مراجع الطلبات',
  role: 'order_reviewer'
});
```

---

## ⚙️ Seed Data

The system automatically creates these test users on startup:

| Username | Password | Role | Full Name |
|----------|----------|------|-----------|
| `admin` | `admin1234` | `admin` | مدير النظام |
| `user` | `user1234` | `call_center` | موظف مركز الاتصال |

---

## 🔒 Backend Authorization

**Note:** The backend currently doesn't have role-based authorization policies implemented on endpoints. All authenticated users can access all endpoints.

**Recommendation for backend team:**
Consider adding role-based authorization attributes to controllers:

```csharp
[Authorize(Roles = "admin")]
[HttpPost("users")]
public async Task<IActionResult> CreateUser(CreateUserRequest request)
{
    // Only admins can create users
}

[Authorize(Roles = "admin,call_center")]
[HttpGet("orders")]
public async Task<IActionResult> GetOrders()
{
    // Admins and call center staff can view orders
}

[Authorize(Roles = "order_reviewer")]
[HttpPost("orders/{id}/review")]
public async Task<IActionResult> ReviewOrder(int id)
{
    // Only reviewers can review orders
}
```

---

## 📊 Role Comparison

| Feature | admin | call_center | order_reviewer |
|---------|-------|-------------|----------------|
| Manage Users | ✅ | ❌ | ❌ |
| Create Orders | ✅ | ✅ | ❌ |
| Edit Orders | ✅ | ✅ | ❌ |
| Delete Orders | ✅ | ❌ | ❌ |
| Review Orders | ✅ | ❌ | ✅ |
| Manage Products | ✅ | ✅ (read) | ✅ (read) |
| Manage Categories | ✅ | ❌ | ❌ |
| View Reports | ✅ | ✅ (limited) | ✅ (limited) |
| System Settings | ✅ | ❌ | ❌ |

---

## 🎯 Best Practices

1. **Always check the role on frontend** before showing admin features
2. **Store user object** (including role) in localStorage after login
3. **Use role-based guards** on protected routes
4. **Filter navigation menus** based on user role
5. **Show appropriate error messages** when users lack permissions
6. **Ask backend to implement** role-based authorization on endpoints

---

## 🧪 Testing Different Roles

```typescript
// Test as admin
await api.post('/auth/login', { 
  username: 'admin', 
  password: 'admin1234' 
});

// Test as call center
await api.post('/auth/login', { 
  username: 'user', 
  password: 'user1234' 
});

// After login, check role:
const user = JSON.parse(localStorage.getItem('user'));
console.log('User role:', user.role);
```

---

## 📝 Summary

**3 roles available:**
- `admin` - Full access  
- `call_center` - Default, normal user access  
- `order_reviewer` - Review orders  

**Test accounts provided:**
- Admin: `admin` / `admin1234`
- Call Center: `user` / `user1234`

**Frontend should:**
- Use role to show/hide features
- Implement role-based routing
- Display appropriate UI for each role

---

**Questions?** Contact the backend team for role-based authorization implementation.
