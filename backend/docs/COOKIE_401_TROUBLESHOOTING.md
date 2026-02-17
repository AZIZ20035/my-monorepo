# 🚨 401 Unauthorized Error - Cookie Not Sent

**Problem:** Getting 401 errors on all authenticated requests

---

## 🔍 Root Cause

**Cookies are domain-specific!** If your frontend and backend use different domains, cookies won't be sent.

### ❌ Common Mistake:

```typescript
// Frontend running on: http://localhost:3000
// Backend URL configured as:
baseURL: 'https://127.0.0.1:7262/api'  // ❌ WRONG!
```

**Issue:** Browser sees `localhost` and `127.0.0.1` as **different domains**. Cookie set by `127.0.0.1` won't be sent to `localhost` requests, and vice versa.

---

## ✅ Solution

### Fix Your Axios Configuration

```typescript
// api.ts or axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7262/api',  // ✅ Use "localhost"
  withCredentials: true                    // ✅ Required for cookies
});

export default api;
```

**CRITICAL:** Use `localhost` in your backend URL, **NOT** `127.0.0.1`!

---

## 🧪 How to Verify the Fix

### 1. Check Your Frontend API Configuration

```typescript
// Should be:
console.log(api.defaults.baseURL);
// ✅ Output: "https://localhost:7262/api"

// Should NOT be:
// ❌ "https://127.0.0.1:7262/api"
```

### 2. Test Login

```typescript
const response = await api.post('/auth/login', {
  username: 'admin',
  password: 'admin1234'
});
console.log(response.data);
```

### 3. Check Cookie in DevTools

1. Open browser DevTools
2. Go to: **Application** → **Cookies**
3. Look for cookies under: `https://localhost:7262`
4. You should see: `auth_token` with **HttpOnly** flag ✅

**Important:** Cookie should be listed under `localhost`, not `127.0.0.1`!

### 4. Check Request Headers

1. Make any authenticated request (e.g., `/dashboard/stats`)
2. Open DevTools → Network tab
3. Click on the request
4. Go to **Headers** section
5. Under **Request Headers**, you should see:
   ```
   Cookie: auth_token=eyJhbGc...
   ```

If you DON'T see the Cookie header, cookies are not being sent!

---

## 🔧 Debugging Steps

### Step 1: Verify Frontend Origin

```typescript
console.log(window.location.origin);
// Should output: "http://localhost:3000" (or your port)
```

### Step 2: Verify Backend URL

```typescript
import api from './api';
console.log(api.defaults.baseURL);
// MUST output: "https://localhost:7262/api"
// NOT: "https://127.0.0.1:7262/api"
```

### Step 3: Verify withCredentials

```typescript
console.log(api.defaults.withCredentials);
// Must output: true
```

### Step 4: Check CORS Headers

After login, check the response headers:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Set-Cookie: auth_token=...; Path=/; HttpOnly; Secure; SameSite=Lax
```

---

## 🚫 Common Mistakes

### Mistake 1: Using 127.0.0.1 instead of localhost
```typescript
❌ baseURL: 'https://127.0.0.1:7262/api'
✅ baseURL: 'https://localhost:7262/api'
```

### Mistake 2: Missing withCredentials
```typescript
❌ const api = axios.create({ baseURL: 'https://localhost:7262/api' });
✅ const api = axios.create({ 
     baseURL: 'https://localhost:7262/api',
     withCredentials: true 
   });
```

### Mistake 3: Not clearing old cookies
If you previously used `127.0.0.1`, you might have old cookies:
1. Open DevTools → Application → Cookies
2. Delete all cookies for both `localhost` and `127.0.0.1`
3. Login again

### Mistake 4: Frontend using HTTPS when should use HTTP
```typescript
// If your frontend is at http://localhost:3000
❌ Frontend changed to: https://localhost:3000
✅ Keep it as: http://localhost:3000
```

---

## 📊 Request Flow Check

### Successful Flow:

```
1. User logs in
   POST https://localhost:7262/api/auth/login
   Response Headers:
   - Set-Cookie: auth_token=...; Path=/; HttpOnly; Secure
   - Access-Control-Allow-Origin: http://localhost:3000
   - Access-Control-Allow-Credentials: true

2. Cookie is saved in browser for domain "localhost"

3. User makes authenticated request
   GET https://localhost:7262/api/dashboard/stats
   Request Headers:
   - Cookie: auth_token=...  ✅ Cookie sent automatically!
   - Origin: http://localhost:3000

4. Backend validates cookie and returns data
   Status: 200 OK
```

### Failed Flow (Domain Mismatch):

```
1. User logs in
   POST https://127.0.0.1:7262/api/auth/login  ❌ Using 127.0.0.1
   Response Headers:
   - Set-Cookie: auth_token=...; Domain=127.0.0.1

2. Cookie is saved for domain "127.0.0.1"

3. User makes authenticated request
   GET https://127.0.0.1:7262/api/dashboard/stats
   Request Headers:
   - Origin: http://localhost:3000  ❌ Different domain!
   - (NO Cookie header)  ❌ Browser doesn't send cookie!

4. Backend sees no cookie, returns 401 Unauthorized
   Status: 401 ❌
```

---

## ✅ Complete Working Example

```typescript
// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7262/api',  // ✅ localhost, not 127.0.0.1
  withCredentials: true,                   // ✅ Required for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for 401 handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Unauthorized - redirecting to login');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

```typescript
// login.ts
import api from './api';

async function login(username: string, password: string) {
  try {
    const response = await api.post('/auth/login', { username, password });
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    console.log('Login successful!');
    console.log('Cookie set by backend (you cannot see it in JS)');
    
    return response.data.data.user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Test after login
async function testAuth() {
  try {
    const response = await api.get('/dashboard/stats');
    console.log('✅ Authenticated request successful!');
    console.log('Data:', response.data);
  } catch (error) {
    console.error('❌ Authenticated request failed:', error);
  }
}
```

---

## 🎯 Quick Checklist

Before asking for help, verify:

- [ ] Frontend API config uses `localhost`, NOT `127.0.0.1`
- [ ] `withCredentials: true` is set in axios config
- [ ] Frontend origin is `http://localhost:XXXX` (not `https` unless you configured it)
- [ ] Backend is accessed via `https://localhost:7262/api`
- [ ] Cleared all cookies and logged in again
- [ ] Can see `auth_token` cookie in DevTools under `localhost` domain
- [ ] Request headers include `Cookie: auth_token=...`
- [ ] CORS headers are present in response

---

## 📞 Still Not Working?

### Provide this information:

1. **Frontend URL:**
   ```typescript
   console.log(window.location.origin);
   // Output: ?
   ```

2. **API Base URL:**
   ```typescript
   console.log(api.defaults.baseURL);
   // Output: ?
   ```

3. **withCredentials:**
   ```typescript
   console.log(api.defaults.withCredentials);
   // Output: ?
   ```

4. **Cookie in DevTools:**
   - Screenshot of Application → Cookies section

5. **Network Request:**
   - Screenshot of Network tab showing Request Headers
   - Specifically show if `Cookie` header is present

---

## 🔐 Security Note

The cookie authentication is **working correctly** - the 401 error is a **configuration issue**, not a security problem. Once you fix the domain mismatch, authentication will work perfectly with full security (HttpOnly cookies).

---

**TL;DR:** Use `localhost` everywhere, not `127.0.0.1`! 🎯
