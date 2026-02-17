# Eid System API Documentation

**Version:** 1.0  
**Base URL:** `https://your-api-host/api`  
**Date:** February 8, 2026

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Dashboard Endpoints](#dashboard-endpoints)
3. [Common Response Format](#common-response-format)
4. [Error Handling](#error-handling)
5. [Authentication & Authorization](#authentication--authorization)

---

## Authentication Endpoints

### Base Route: `/api/auth`

---

#### 1. Login (POST `/api/auth/login`) 🔑

**Purpose:** Authenticate user and set secure HTTP-only cookie with JWT token.

**Authorization:** Public (No token required)

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "userId": 1,
      "username": "admin",
      "fullName": "مدير النظام",
      "role": "admin",
      "isActive": true,
      "createdAt": "2026-02-07T13:53:11"
    }
  }
}
```

**Cookie Set (Automatic):**
- Name: `auth_token`
- Value: JWT token (not exposed to JavaScript)
- HttpOnly: `true`
- Secure: `true` (HTTPS only)
- SameSite: `Strict`
- Expires: 7 days from login
- Path: `/`

**Error Responses:**
- `401 Unauthorized`: Invalid username or password
```json
{
  "success": false,
  "message": "اسم المستخدم أو كلمة المرور غير صحيحة"
}
```

**Implementation Details:**
- Password verification uses BCrypt hashing
- JWT token stored in HTTP-only cookie (inaccessible to JavaScript)
- Token expires in 7 days
- User must be active (`isActive = true`)
- Token includes claims: `userId`, `username`, `fullName`, `role`
- Cookie automatically sent with all subsequent requests

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin1234`

**cURL Example:**
```bash
curl -X POST https://api-host/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin1234"}' \
  -c cookies.txt
```

---

#### 2. Get Current User (GET `/api/auth/me`) 👤

**Purpose:** Retrieve currently authenticated user information.

**Authorization:** Required (Cookie-based)

**Headers:**
No Authorization header needed - cookie is sent automatically by browser.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "username": "admin",
    "fullName": "مدير النظام",
    "role": "admin",
    "isActive": true,
    "createdAt": "2026-02-07T13:53:11"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found in database

**cURL Example:**
```bash
curl -X GET https://api-host/api/auth/me \
  -b cookies.txt
```

---

#### 3. Change Password (POST `/api/auth/change-password`) 🔒

**Purpose:** Change the current user's password.

**Authorization:** Required (Cookie-based)

**Headers:**
No Authorization header needed - cookie is sent automatically by browser.

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح",
  "data": null
}
```

**Error Responses:**
- `400 Bad Request`: Current password is incorrect
```json
{
  "success": false,
  "message": "كلمة المرور الحالية غير صحيحة"
}
```
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

**Implementation Details:**
- Verifies current password before updating
- New password is hashed using BCrypt with salt rounds = 12
- Updates `UpdatedAt` timestamp

**cURL Example:**
```bash
curl -X POST https://api-host/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"old","newPassword":"newSecret"}' \
  -b cookies.txt
```

---

#### 4. Logout (POST `/api/auth/logout`) 🚪

**Purpose:** Logout current user and clear authentication cookie.

**Authorization:** Required (Cookie-based)

**Headers:**
No Authorization header needed - cookie is sent automatically by browser.

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح",
  "data": null
}
```

**Implementation Details:**
- Deletes the `auth_token` cookie
- Client should redirect to login page after logout
- Subsequent requests will return 401 Unauthorized

**cURL Example:**
```bash
curl -X POST https://api-host/api/auth/logout \
  -b cookies.txt
```

---

## Dashboard Endpoints

### Base Route: `/api/dashboard`

All dashboard endpoints require authentication. Cookie is automatically sent by browser.

**Headers:**
No Authorization header needed - authentication cookie handled automatically.

---

#### 1. Get Dashboard Statistics (GET `/api/dashboard/stats`) 📈

**Purpose:** Get overall system statistics including orders, revenue, and customers.

**Authorization:** Required (Cookie-based)

**Headers:**
No Authorization header needed - cookie is sent automatically by browser.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "todayOrders": 12,
    "pendingOrders": 5,
    "preparingOrders": 3,
    "deliveredOrders": 142,
    "totalRevenue": 125000.50,
    "todayRevenue": 8500.00,
    "unpaidAmount": 2300.00,
    "totalCustomers": 87,
    "newCustomersToday": 4
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `totalOrders` | int | Total number of orders in system |
| `todayOrders` | int | Orders created today |
| `pendingOrders` | int | Orders with status = "pending" |
| `preparingOrders` | int | Orders with status = "preparing" |
| `deliveredOrders` | int | Orders with status = "delivered" |
| `totalRevenue` | decimal | Sum of all order total costs |
| `todayRevenue` | decimal | Revenue from today's orders |
| `unpaidAmount` | decimal | Sum of all remaining unpaid amounts |
| `totalCustomers` | int | Total customer count |
| `newCustomersToday` | int | Customers registered today |

**Implementation Details:**
- "Today" is based on server's `DateTime.Today`
- Revenue calculations sum `Order.TotalCost`
- Unpaid amounts sum `Order.RemainingAmount`
- All currency values are in decimal format (SAR)

**cURL Example:**
```bash
curl -X GET https://api-host/api/dashboard/stats \
  -b cookies.txt
```

---

#### 2. Get Period Availability (GET `/api/dashboard/period-availability`) 📅

**Purpose:** Get availability status for all active Eid day periods (delivery time slots).

**Authorization:** Required (Cookie-based)

**Headers:**
No Authorization header needed - cookie is sent automatically by browser.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "eidDayPeriodId": 1,
      "dayName": "اليوم الأول",
      "periodName": "الفترة الصباحية",
      "available": 45,
      "total": 50,
      "isFull": false
    },
    {
      "eidDayPeriodId": 2,
      "dayName": "اليوم الأول",
      "periodName": "الفترة المسائية",
      "available": 0,
      "total": 50,
      "isFull": true
    },
    {
      "eidDayPeriodId": 3,
      "dayName": "اليوم الثاني",
      "periodName": "الفترة الصباحية",
      "available": 30,
      "total": 50,
      "isFull": false
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `eidDayPeriodId` | int | Unique ID for this day-period combination |
| `dayName` | string | Eid day name in Arabic |
| `periodName` | string | Period/time slot name in Arabic |
| `available` | int | Remaining capacity (total - current orders) |
| `total` | int | Maximum capacity for this period |
| `isFull` | bool | True if period has reached capacity |

**Implementation Details:**
- Only returns active periods (`IsActive = true`)
- Results sorted by day order, then period order
- Available = `MaxCapacity - CurrentOrders`
- IsFull = `CurrentOrders >= MaxCapacity`

**cURL Example:**
```bash
curl -X GET https://api-host/api/dashboard/period-availability \
  -b cookies.txt
```

---

## Common Response Format

All API responses follow a consistent envelope format:

### Success Response:
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { /* response data */ }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Validation errors, business rule violations |
| 401 | Unauthorized | Missing/invalid/expired token, wrong credentials |
| 404 | Not Found | Requested resource doesn't exist |
| 500 | Internal Server Error | Unexpected server errors |

### Common Error Scenarios

#### 1. Unauthorized (401)
```json
{
  "success": false,
  "message": "اسم المستخدم أو كلمة المرور غير صحيحة"
}
```
**Solution:** Check credentials or re-login to get new token.

#### 2. Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Username is required",
    "Password must be at least 8 characters"
  ]
}
```
**Solution:** Fix validation issues in request.

#### 3. Not Found (404)
```json
{
  "success": false,
  "message": "User with ID 123 not found"
}
```
**Solution:** Verify the resource ID exists.

---

## Authentication & Authorization

### HTTP-Only Cookie Authentication

**Security Model:**
- JWT tokens are stored in **HTTP-only cookies**
- JavaScript **cannot access** the token (XSS protection)
- Browser **automatically sends** cookie with each request
- Backend **fully controls** token lifecycle

### JWT Token Details (Internal - Not Exposed to Frontend)

**Token Structure:**
- **Algorithm:** HMAC-SHA256
- **Expiration:** 7 days from issuance
- **Storage:** HTTP-only cookie named `auth_token`
- **Claims included:**
  - `ClaimTypes.NameIdentifier`: User ID
  - `ClaimTypes.Name`: Username
  - `ClaimTypes.GivenName`: Full name
  - `ClaimTypes.Role`: User role
  - `userId`: Custom claim with user ID

**Issuer:** `EidSystem.API`  
**Audience:** `EidSystem.Client`

### Using Cookie-Based Authentication

**1. Login to receive cookie:**
```bash
POST /api/auth/login
Body: {"username":"admin","password":"admin1234"}
```
Server sets `auth_token` cookie automatically.

**2. Make authenticated requests:**
No special headers needed! Browser automatically includes cookie.

**3. Cookie is automatically sent:**
- Browser handles cookie with every request
- No manual token management needed
- Works for all protected endpoints

**4. Logout to clear cookie:**
```bash
POST /api/auth/logout
```
Server deletes the cookie.

### Security Best Practices

1. **Cookies are secure by default:**
   - HttpOnly flag prevents JavaScript access
   - Secure flag requires HTTPS
   - SameSite=Strict prevents CSRF attacks
   - No token storage needed in frontend

2. **Handle authentication errors:**
   - Check for 401 Unauthorized responses
   - Redirect to login page on authentication failure
   - No need to manually refresh tokens

3. **CORS Configuration:**
   - Backend whitelist specific frontend origins
   - `withCredentials: true` required in frontend HTTP client
   - Cookies only sent to whitelisted domains

4. **Production requirements:**
   - Always use HTTPS
   - Configure exact frontend origin in `appsettings.json`
   - Never use `AllowAnyOrigin` with credentials

---

## TypeScript/JavaScript Integration Examples

### Setup Axios Instance
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-host/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // REQUIRED: Enables cookie sending
});

// Handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Login Example
```typescript
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  user: {
    userId: number;
    username: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
}

async function login(username: string, password: string) {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
    username,
    password
  });
  
  if (response.data.success && response.data.data) {
    // Cookie is set automatically by browser
    // Just store user info if needed
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    return response.data.data;
  }
  
  throw new Error(response.data.message || 'Login failed');
}
```

### Logout Example
```typescript
async function logout() {
  try {
    await api.post('/auth/logout');
    // Clear any local user data
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
```

### Get Dashboard Stats Example
```typescript
interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  unpaidAmount: number;
  totalCustomers: number;
  newCustomersToday: number;
}

async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  
  throw new Error(response.data.message || 'Failed to fetch stats');
}
```

### TypeScript Type Definitions
```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

interface LoginResponse {
  user: UserResponse;
  // Token is in HTTP-only cookie, not in response
}

interface UserResponse {
  userId: number;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface PeriodAvailabilityResponse {
  eidDayPeriodId: number;
  dayName: string;
  periodName: string;
  available: number;
  total: number;
  isFull: boolean;
}
```

---

## Frontend Configuration Requirements

### Important: CORS & Credentials Setup

**Backend Configuration (appsettings.json):**
```json
{
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://yourdomain.com"
  ]
}
```

**Frontend Requirements:**

1. **Axios Configuration:**
```typescript
axios.defaults.withCredentials = true;
// OR per instance:
const api = axios.create({
  withCredentials: true
});
```

2. **Fetch API Configuration:**
```typescript
fetch('https://api-host/api/auth/login', {
  method: 'POST',
  credentials: 'include',  // REQUIRED for cookies
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ username, password })
});
```

3. **Important Notes:**
   - **Must** set `withCredentials: true` or `credentials: 'include'`
   - Frontend origin **must** match exactly one in `AllowedOrigins`
   - Protocol, domain, and port must all match (e.g., `http://localhost:3000`)
   - HTTPS required in production for Secure cookie flag

### Development vs Production

**Development (Local):**
- Origins: `http://localhost:3000`, `http://localhost:5173`, etc.
- Secure cookie flag: Works with HTTP
- Same machine testing

**Production:**
- Origin: `https://yourdomain.com` (exact match required)
- Secure cookie flag: HTTPS only
- Update `appsettings.json` with production URL

---

## Testing with Postman

### Environment Variables
Create a Postman environment with:
```json
{
  "base_url": "https://your-api-host/api"
}
```

Note: No need to store token - Postman handles cookies automatically!

### Collection Structure
1. **Auth Folder**
   - Login (saves cookie automatically)
   - Get Current User
   - Change Password
   - Logout

2. **Dashboard Folder**
   - Get Stats
   - Get Period Availability

### Postman Cookie Handling
Postman automatically:
- Saves cookies from responses
- Sends cookies with subsequent requests to same domain
- No manual cookie management needed

### Test Script for Login
```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  if (response.success && response.data.user) {
    console.log('Login successful! User:', response.data.user.username);
    console.log('Cookie set automatically by Postman');
  }
}
```

---

## Recommendations for Frontend Development

### UI/UX Best Practices

1. **Login Flow:**
   - Show loading state during authentication
   - Display Arabic error messages from API
   - No need to manually store tokens (cookies handled automatically)
   - Implement "Remember me" by extending cookie expiration (backend change)
   - Check authentication by calling `/api/auth/me` on app load

2. **Dashboard:**
   - Refresh stats every 30-60 seconds
   - Show loading skeletons during data fetch
   - Use visual indicators for period capacity:
     - Green: > 50% available
     - Yellow: 10-50% available
     - Red: < 10% or full
   - Display real-time updates when orders are created

3. **Error Handling:**
   - Show user-friendly messages from `response.message`
   - Log technical errors to console/monitoring
   - Implement retry logic for network failures
   - Show offline state when API is unreachable

4. **Performance:**
   - Cache dashboard data appropriately
   - Implement optimistic UI updates
   - Use pagination for large datasets
   - Compress API responses (gzip)

5. **Accessibility:**
   - Support RTL layout for Arabic content
   - Ensure proper ARIA labels
   - Keyboard navigation support
   - Screen reader compatibility

---

## Support & Contact

For API issues or questions, contact the backend development team.

**Last Updated:** February 8, 2026  
**API Version:** 1.0
