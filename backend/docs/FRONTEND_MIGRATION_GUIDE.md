# 🔒 Authentication Migration Guide - Frontend Developer

**Date:** February 8, 2026  
**Breaking Changes:** Authentication now uses HTTP-only cookies instead of Bearer tokens

---

## 🚨 What Changed

### Old Method (Deprecated)
```typescript
// ❌ OLD - Don't use anymore
const response = await axios.post('/api/auth/login', { username, password });
localStorage.setItem('token', response.data.data.token);
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### New Method (Required)
```typescript
// ✅ NEW - Use this
axios.defaults.withCredentials = true;  // ONE TIME SETUP
const response = await axios.post('/api/auth/login', { username, password });
// That's it! Cookie is set automatically by browser
```

---

## ⚡ Quick Migration Checklist

- [ ] Add `withCredentials: true` to axios/fetch configuration
- [ ] Remove all `localStorage.setItem('token', ...)` code
- [ ] Remove all `Authorization: Bearer` header logic
- [ ] Remove token from state management (Redux/Zustand/etc)
- [ ] Update login to only store user info (not token)
- [ ] Add logout API call to clear cookie
- [ ] Test authentication with browser DevTools → Cookies

---

## 📋 Required Code Changes

### 1. Axios Configuration (REQUIRED)

**Create/Update your API instance:**

```typescript
// api.ts or apiClient.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // 🔑 CRITICAL: Enables cookie sending
});

// Handle authentication errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login when unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Login Function (Updated)

```typescript
// auth.service.ts or similar
interface LoginResponse {
  user: {
    userId: number;
    username: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
  // ❌ NO MORE: token, expiresAt
}

export async function login(username: string, password: string) {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
    username,
    password
  });
  
  if (response.data.success && response.data.data) {
    // ✅ Only store user info (NOT token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    return response.data.data.user;
  }
  
  throw new Error(response.data.message || 'Login failed');
}
```

### 3. Logout Function (NEW - Required)

```typescript
export async function logout() {
  try {
    await api.post('/auth/logout');
    // Clear local user data
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
    // Still redirect even if API call fails
    window.location.href = '/login';
  }
}
```

### 4. Check Authentication on App Load

```typescript
// App.tsx or root component
useEffect(() => {
  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      // Not authenticated or token expired
      setUser(null);
    }
  };
  
  checkAuth();
}, []);
```

### 5. Fetch API Alternative (if not using Axios)

```typescript
async function login(username: string, password: string) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    credentials: 'include',  // 🔑 CRITICAL: Enables cookie sending
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data.user;
  }
  
  throw new Error(data.message);
}

// For all other requests
fetch(url, {
  credentials: 'include'  // Always include this
});
```

---

## 🔗 Updated API Endpoints

### Login (POST `/api/auth/login`)

**Request:**
```json
{
  "username": "admin",
  "password": "admin1234"
}
```

**Response (NEW - No Token):**
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

**Cookie Set Automatically:**
- Name: `auth_token`
- HttpOnly: true (JavaScript cannot access)
- Secure: true (HTTPS only)
- SameSite: Strict
- Expires: 7 days

### Logout (POST `/api/auth/logout`) - NEW ENDPOINT

**Request:** No body

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح",
  "data": null
}
```

**Effect:** Clears `auth_token` cookie

### All Other Endpoints

No changes! Just ensure `withCredentials: true` is set.

---

## 🎯 TypeScript Types (Updated)

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

interface LoginResponse {
  user: UserResponse;
  // Token removed from response
}

interface UserResponse {
  userId: number;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}
```

---

## 🧪 Testing Instructions

### 1. Test Login Flow

1. Open browser DevTools → Application → Cookies
2. Call login API
3. **Verify:** `auth_token` cookie appears with these flags:
   - HttpOnly: ✓
   - Secure: ✓
   - SameSite: Strict
   - Expires: ~7 days from now

### 2. Test Protected Endpoints

1. After login, call `/api/dashboard/stats`
2. **Verify:** Request works without Authorization header
3. **Verify:** Cookie is sent automatically in request headers

### 3. Test Logout

1. Call logout API
2. **Verify:** `auth_token` cookie is deleted
3. **Verify:** Calling protected endpoints returns 401

### 4. Test Token Expiration

1. Manually delete `auth_token` cookie in DevTools
2. Call any protected endpoint
3. **Verify:** Returns 401 Unauthorized
4. **Verify:** App redirects to login

---

## ⚠️ Common Issues & Solutions

### Issue: "CORS error: credentials mode"
**Solution:** 
- Ensure `withCredentials: true` in axios config
- Backend must whitelist your exact origin (not `*`)
- Check backend `AllowedOrigins` includes your URL

### Issue: "Cookie not being sent"
**Solution:**
- Verify `withCredentials: true` or `credentials: 'include'`
- Check frontend and backend are on same domain or CORS is configured
- For localhost: use same port or configure CORS properly

### Issue: "Cookie not visible in DevTools"
**Solution:**
- Normal! HttpOnly cookies don't appear in JavaScript
- Check Application → Cookies (not Console)
- Cookie is still sent with requests automatically

### Issue: "401 on localhost development"
**Solution:**
- Backend `AllowedOrigins` must include `http://localhost:YOUR_PORT`
- Protocol (http/https), domain, and port must match exactly
- For HTTPS local: May need to set `Secure: false` in development

---

## 🔐 Security Benefits

✅ **XSS Protection:** JavaScript malware cannot steal token  
✅ **CSRF Protection:** SameSite=Strict prevents cross-site attacks  
✅ **No Manual Storage:** Eliminates localStorage security risks  
✅ **Automatic:** Browser handles all cookie management  
✅ **Backend Controlled:** Server fully manages token lifecycle  

---

## 📚 Additional Resources

- Complete API Documentation: `docs/api_documentation.md`
- Backend Configuration: `appsettings.json` → `AllowedOrigins`
- Test Credentials: 
  - Username: `admin`
  - Password: `admin1234`

---

## 🤝 Need Help?

If you encounter issues:
1. Check browser DevTools → Network → Request Headers (Cookie should be present)
2. Check browser DevTools → Application → Cookies (auth_token should exist)
3. Verify `withCredentials: true` is set globally in axios
4. Verify backend CORS `AllowedOrigins` includes your frontend URL
5. Contact backend team with error details

---

## 📝 Example: Complete React Login Component

```typescript
// LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api'; // Your configured axios instance

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        // Store only user info (NOT token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

---

**Migration Deadline:** Immediate  
**Backward Compatibility:** None - old token method no longer works  
**Estimated Migration Time:** 30-60 minutes

Good luck! 🚀
