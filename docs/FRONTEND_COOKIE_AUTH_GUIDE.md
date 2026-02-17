# 🔐 Frontend Cookie Authentication Guide

**Date:** February 8, 2026  
**Security Level:** ✅ High - Token NOT accessible to JavaScript

---

## 🎯 What You Need to Know

The backend uses **HTTP-only cookies** for authentication. This means:

✅ **You CANNOT access the token** - This is intentional for security  
✅ **Cookies are sent automatically** - You don't need to manage tokens  
✅ **XSS attacks cannot steal the token** - JavaScript cannot read it  

---

## 📝 Complete Frontend Setup

### 1. Configure Axios (Do This Once)

```typescript
// api.ts or axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7262/api',  // Backend URL (HTTPS)
  withCredentials: true  // ⚠️ CRITICAL: Required for cookies!
});

export default api;
```

---

### 2. Login Implementation

```typescript
// login.ts
import api from './api';

async function login(username: string, password: string) {
  try {
    const response = await api.post('/auth/login', {
      username,
      password
    });

    // Response structure:
    // {
    //   success: true,
    //   message: "تم تسجيل الدخول بنجاح",
    //   data: {
    //     user: {
    //       userId: 1,
    //       username: "admin",
    //       fullName: "System Admin",
    //       role: "admin",
    //       isActive: true,
    //       createdAt: "2026-02-08T..."
    //     }
    //   }
    // }

    if (response.data.success) {
      const user = response.data.data.user;
      
      // ✅ Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // ⚠️ NO TOKEN in response - it's already in a secure cookie!
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
      // OR: router.push('/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
```

---

### 3. Making Authenticated Requests

```typescript
// After login, ALL requests automatically include the auth cookie!

// Get dashboard stats
const stats = await api.get('/dashboard/stats');

// Get current user
const me = await api.get('/auth/me');

// Create order
const order = await api.post('/orders', orderData);

// NO NEED TO:
// ❌ Add Authorization header
// ❌ Get token from localStorage
// ❌ Manually attach token to requests

// The cookie is sent automatically by the browser!
```

---

### 4. Logout Implementation

```typescript
// logout.ts
import api from './api';

async function logout() {
  try {
    // Call logout endpoint to clear cookie on server
    await api.post('/auth/logout');
    
    // Clear local user data
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/login';
    // OR: router.push('/login');
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if API fails, clear local data and redirect
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
```

---

### 5. Check Authentication

```typescript
// Get current user from server
async function getCurrentUser() {
  try {
    const response = await api.get('/auth/me');
    return response.data.data; // User object
  } catch (error) {
    // 401 = Not authenticated
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
}
```

---

## 🔒 What You CANNOT Do (By Design)

```typescript
// ❌ You CANNOT access the token
document.cookie  // Will NOT show auth_token (it's HttpOnly)

// ❌ You CANNOT read the token
localStorage.getItem('token')  // Token is NOT in localStorage

// ❌ You CANNOT manually send the token
axios.defaults.headers.common['Authorization'] = 'Bearer ...'  // Not needed!

// This is INTENTIONAL for security!
```

---

## ✅ What You CAN Do

```typescript
// ✅ Check if user is logged in (from localStorage)
const user = JSON.parse(localStorage.getItem('user') || 'null');
const isLoggedIn = user !== null;

// ✅ Get user info
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.username, user.role);

// ✅ Make authenticated requests
await api.get('/dashboard/stats');  // Cookie sent automatically

// ✅ Logout
await api.post('/auth/logout');
```

---

## 🧪 Testing & Verification

### Test Login Flow

1. **Login with credentials:**
   ```typescript
   await api.post('/auth/login', {
     username: 'admin',
     password: 'admin1234'
   });
   ```

2. **Open Browser DevTools:**
   - Go to: **Application** → **Cookies**
   - Look for: `auth_token` cookie
   - Verify: **HttpOnly** flag is checked ✅

3. **Make authenticated request:**
   ```typescript
   await api.get('/auth/me');
   // Should return user data without 401 error
   ```

4. **Logout:**
   ```typescript
   await api.post('/auth/logout');
   ```

5. **Verify logout:**
   - Check cookies - `auth_token` should be deleted
   - Try: `await api.get('/auth/me')` → Should get 401 error

---

## ⚠️ Common Issues & Solutions

### Issue 1: "401 Unauthorized on every request"

**Cause:** `withCredentials: true` is missing

**Fix:**
```typescript
const api = axios.create({
  baseURL: 'http://localhost:5282/api',
  withCredentials: true  // Add this!
});
```

---

### Issue 2: "CORS error"

**Cause:** Your frontend URL is not in backend's allowed origins

**Fix:** Contact backend team with your frontend URL. They need to add it to `appsettings.json`:
```json
{
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173",
    "YOUR_URL_HERE"
  ]
}
```

---

### Issue 3: "Cookie not visible in DevTools"

**Possible causes:**
1. Login failed - Check API response
2. Wrong URL - Ensure you're using `https://localhost:7262/api`
3. Not using `withCredentials: true`

**Verify:**
```typescript
console.log(axios.defaults.withCredentials); // Should be true
```

---

### Issue 4: "Cookie deleted immediately"

**Cause:** Cookie domain/path mismatch

**Fix:** Ensure:
- Frontend and backend on same domain (both localhost)
- Backend is using HTTPS: `https://localhost:7262`
- Frontend is using `withCredentials: true`

---

## 📊 Request/Response Examples

### Login Request
```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "username": "admin",
  "password": "admin1234"
}
```

### Login Response
```http
HTTP/1.1 200 OK
Set-Cookie: auth_token=eyJhbGc...; Path=/; HttpOnly; SameSite=Lax

{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "userId": 1,
      "username": "admin",
      "fullName": "System Admin",
      "role": "admin",
      "isActive": true,
      "createdAt": "2026-02-08T15:30:00Z"
    }
  }
}
```

**Notice:** No token in response body! It's in the `Set-Cookie` header.

---

### Authenticated Request
```http
GET /api/dashboard/stats HTTP/1.1
Cookie: auth_token=eyJhbGc...
```

**Notice:** Cookie sent automatically by browser!

---

## 🔄 Complete Auth Flow

```typescript
// 1. User visits login page
// 2. User enters credentials

// 3. Frontend calls login API
const response = await api.post('/auth/login', { username, password });

// 4. Backend returns user data + sets cookie
//    Cookie: auth_token=... (HttpOnly, cannot be accessed by JS)

// 5. Frontend stores user data
localStorage.setItem('user', JSON.stringify(response.data.data.user));

// 6. Redirect to dashboard
router.push('/dashboard');

// 7. All subsequent requests automatically include cookie
await api.get('/dashboard/stats');  // Cookie sent by browser

// 8. User clicks logout
await api.post('/auth/logout');

// 9. Backend deletes cookie
localStorage.removeItem('user');
router.push('/login');
```

---

## 🎯 Quick Checklist

Before deploying to production:

- [ ] `withCredentials: true` is set on axios instance
- [ ] Login stores user in localStorage (NOT token)
- [ ] Logout calls `/auth/logout` API
- [ ] Logout clears localStorage
- [ ] Protected routes check `localStorage.getItem('user')`
- [ ] 401 errors redirect to login page
- [ ] No code tries to access the token
- [ ] No code sets Authorization headers
- [ ] Tested login/logout flow
- [ ] Verified cookie in DevTools

---

## 🚀 React Example (Complete)

```typescript
// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7262/api',
  withCredentials: true
});

// Intercept 401 errors
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

export default api;
```

```typescript
// useAuth.ts
import { useState, useEffect } from 'react';
import api from './api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const userData = response.data.data.user;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, login, logout, loading, isAuthenticated: !!user };
}
```

```typescript
// LoginPage.tsx
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await login(
        formData.get('username'),
        formData.get('password')
      );
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

---

## 📞 Support

**Backend Status:** ✅ Fully implemented and tested

**Test Credentials:**

*Admin User:*
- Username: `admin`
- Password: `admin1234`
- Role: Admin (full access)

*Normal User:*
- Username: `user`
- Password: `user1234`
- Role: User (limited access)

**Backend URL:**
- HTTPS: `https://localhost:7262/api` ✅

**Questions?** Contact the backend team!

---

**Security Level:** 🔐 High - Token is completely hidden from JavaScript  
**Difficulty:** ⭐ Easy - Less code than bearer tokens!  
**Status:** ✅ Ready to implement immediately
