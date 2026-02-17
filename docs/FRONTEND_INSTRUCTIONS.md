# 📋 FRONTEND DEVELOPER - AUTHENTICATION SETUP INSTRUCTIONS

**⏱️ Time Required:** 10 minutes  
**Difficulty:** Easy

---

## 🎯 What You Need to Know

The backend uses **HTTP-only cookies** for authentication. This means:
- You DON'T manage tokens manually
- Cookies are set automatically when user logs in
- Cookies are sent automatically on every request
- You CANNOT see the token (security feature)

---

## ✅ STEP 1: Configure Axios (One-Time Setup)

Create or update your API configuration file:

```typescript
// src/api/index.ts (or wherever you configure axios)
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7262/api',  // Backend URL
  withCredentials: true                    // REQUIRED for cookies!
});

// Optional: Handle 401 errors automatically
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

**⚠️ IMPORTANT:**
- Use `localhost`, NOT `127.0.0.1`
- Must have `withCredentials: true`

---

## ✅ STEP 2: Implement Login

Update your login function:

```typescript
// src/services/authService.ts (or similar)
import api from './api';

export async function login(username: string, password: string) {
  try {
    // Call login API
    const response = await api.post('/auth/login', {
      username,
      password
    });

    // Backend automatically sets cookie in response!
    // You don't need to do anything with the cookie

    // Just store user data (NOT token)
    const user = response.data.data.user;
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function logout() {
  try {
    // Call logout API to clear cookie on server
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    // Always clear local data
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}
```

**What happens when user logs in:**
1. You call `POST /auth/login`
2. Backend returns user data
3. **Backend automatically sets cookie in response** (you don't see it)
4. You store user data in localStorage
5. Done! All future requests automatically include the cookie

---

## ✅ STEP 3: Use in Your Components

### React Example:

```typescript
// LoginPage.tsx
import { useState } from 'react';
import { login } from './services/authService';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      // Login successful! Cookie is now set by backend
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginPage;
```

### Vue Example:

```typescript
// LoginPage.vue
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/authService';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  error.value = '';

  try {
    await login(username.value, password.value);
    // Login successful! Cookie is now set by backend
    router.push('/dashboard');
  } catch (err) {
    error.value = 'Invalid username or password';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <input v-model="username" type="text" placeholder="Username" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <p v-if="error" style="color: red">{{ error }}</p>
    <button type="submit" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>
```

---

## ✅ STEP 4: Make Authenticated Requests

After login, ALL requests automatically include the cookie!

```typescript
// Just make requests normally - cookie is sent automatically!

import api from './api';

// Get dashboard data
async function getDashboardStats() {
  const response = await api.get('/dashboard/stats');
  return response.data;
}

// Get orders
async function getOrders() {
  const response = await api.get('/orders');
  return response.data;
}

// Create order
async function createOrder(orderData) {
  const response = await api.post('/orders', orderData);
  return response.data;
}

// NO NEED TO:
// ❌ Add Authorization header
// ❌ Get token from localStorage
// ❌ Manually attach token
// The cookie is sent automatically by the browser!
```

---

## 🧪 Testing Instructions

### Test 1: Login

```typescript
// In browser console:
import api from './api';

const result = await api.post('/auth/login', {
  username: 'admin',
  password: 'admin1234'
});

console.log(result.data);
// Should show: { success: true, data: { user: {...} } }
```

**After login:**
1. Open DevTools → Application → Cookies
2. Look under `https://localhost:7262`
3. You should see: `auth_token` cookie

### Test 2: Authenticated Request

```typescript
// Make any authenticated request
const stats = await api.get('/dashboard/stats');
console.log(stats.data);
// Should work! Cookie is sent automatically
```

---

## ❌ What NOT to Do

```typescript
// ❌ DON'T try to access the token
localStorage.setItem('token', response.data.data.token);  // NO token in response!

// ❌ DON'T try to set Authorization header
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Not needed!

// ❌ DON'T try to read the cookie
document.cookie;  // Won't show auth_token (it's HttpOnly)

// ❌ DON'T use 127.0.0.1
baseURL: 'https://127.0.0.1:7262/api'  // Use localhost instead!
```

---

## 🔧 Complete Working Example

Here's a complete working example you can copy:

```typescript
// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7262/api',
  withCredentials: true
});

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

// authService.ts
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

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
};

// dashboardService.ts
export const dashboardService = {
  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  async getPeriodAvailability() {
    const response = await api.get('/dashboard/period-availability');
    return response.data;
  }
};
```

---

## 📝 Checklist

- [ ] Created axios instance with `withCredentials: true`
- [ ] Using `https://localhost:7262/api` (not 127.0.0.1)
- [ ] Implemented login function
- [ ] Implemented logout function
- [ ] Storing user data in localStorage (NOT token)
- [ ] Removed old token management code
- [ ] Tested login in browser
- [ ] Verified cookie appears in DevTools after login
- [ ] Tested authenticated requests work

---

## 🎯 Test Credentials

**Admin User:**
- **Username:** `admin`
- **Password:** `admin1234`
- **Role:** `admin` (full system access)

**Call Center User:**
- **Username:** `user`
- **Password:** `user1234`
- **Role:** `call_center` (normal user access)

**Available Roles:**
- `admin` - Administrator (full access)
- `call_center` - Call Center Staff (default for normal users)
- `order_reviewer` - Order Reviewer

---

## 🆘 Troubleshooting

### Problem: 401 Unauthorized

**Solution:** Make sure you logged in first! The cookie only exists after successful login.

```typescript
// 1. Login first
await authService.login('admin', 'admin1234');

// 2. Then make requests
await dashboardService.getStats();  // Now works!
```

### Problem: CORS Error

**Solution:** Check that you're using `localhost` and not `127.0.0.1`

### Problem: Cookie not visible

**Solution:** Check Application → Cookies → `https://localhost:7262` (not http)

---

## 📞 Questions?

Contact the backend team with:
1. What you tried
2. Error messages from console
3. Screenshot of Network tab for failed request

---

**That's it! Cookie authentication is actually SIMPLER than bearer tokens!** 🎉

You just:
1. Set `withCredentials: true` once
2. Call login endpoint
3. Everything works automatically!
