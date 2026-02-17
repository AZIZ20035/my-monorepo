# 🧪 Testing Cookie Authentication - Step by Step

**Follow these steps EXACTLY to test authentication**

---

## ✅ Step 1: Login First

You MUST login before making any authenticated requests!

```typescript
// 1. Login
const response = await api.post('/auth/login', {
  username: 'admin',
  password: 'admin1234'
});

console.log('Login response:', response.data);

// 2. Store user data
localStorage.setItem('user', JSON.stringify(response.data.data.user));
```

**Expected response:**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": {
      "userId": 1,
      "username": "admin",
      "fullName": "System Admin",
      "role": "admin",
      "isActive": true
    }
  }
}
```

---

## ✅ Step 2: Verify Cookie Was Set

**Immediately after login:**

1. Open DevTools → Application → Cookies
2. Look under `https://localhost:7262`
3. You should see: `auth_token` cookie with value
4. Check the flags:
   - ✅ HttpOnly: true
   - ✅ Secure: true
   - ✅ SameSite: Lax
   - ✅ Path: /

**If you DON'T see the cookie:**
- Login failed
- Check console for errors
- Check Network tab for login response
- Verify `Set-Cookie` header in login response

---

## ✅ Step 3: Make Authenticated Request

**Only after successful login:**

```typescript
// Now make authenticated requests
const statsResponse = await api.get('/dashboard/stats');
console.log('Stats:', statsResponse.data);

const periodResponse = await api.get('/dashboard/period-availability');
console.log('Periods:', periodResponse.data);
```

---

## ✅ Step 4: Verify Cookie Is Sent

**Check Network tab:**

1. Click on the request (e.g., `/dashboard/period-availability`)
2. Go to Headers tab
3. Scroll down to **Request Headers**
4. You MUST see:
   ```
   Cookie: auth_token=eyJhbGc...
   ```

**If Cookie header is MISSING:**
- You didn't login first
- Cookie wasn't set during login
- `withCredentials: true` is not configured
- Domain mismatch (using 127.0.0.1 somewhere)

---

## 🔧 Complete Test Script

Copy and paste this in your browser console (after configuring axios):

```typescript
// Complete test script
async function testAuth() {
  console.log('=== Starting Authentication Test ===');
  
  // Step 1: Login
  console.log('\n1. Logging in...');
  try {
    const loginResponse = await api.post('/auth/login', {
      username: 'admin',
      password: 'admin1234'
    });
    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.data.user);
    
    // Store user
    localStorage.setItem('user', JSON.stringify(loginResponse.data.data.user));
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return;
  }
  
  // Step 2: Check cookie
  console.log('\n2. Checking cookie...');
  console.log('Check DevTools → Application → Cookies → https://localhost:7262');
  console.log('You should see: auth_token cookie with HttpOnly flag');
  
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Step 3: Test authenticated request
  console.log('\n3. Testing authenticated request...');
  try {
    const response = await api.get('/dashboard/stats');
    console.log('✅ Authenticated request successful!');
    console.log('Data:', response.data);
  } catch (error) {
    console.error('❌ Authenticated request failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    
    if (error.response?.status === 401) {
      console.error('\n🔍 Debugging 401:');
      console.error('- Cookie was not sent in request');
      console.error('- Check: Is withCredentials: true set?');
      console.error('- Check: Was login successful?');
      console.error('- Check: Is cookie visible in DevTools?');
    }
  }
  
  console.log('\n=== Test Complete ===');
}

// Run the test
testAuth();
```

---

## 🐛 Common Mistakes

### Mistake 1: Making requests before logging in
```typescript
❌ const data = await api.get('/dashboard/stats');  // No login first!
```

You MUST login first to get the cookie!

### Mistake 2: Not checking if login succeeded
```typescript
❌ await api.post('/auth/login', credentials);
   // Didn't check if it worked!
   await api.get('/dashboard/stats');  // Will fail!
```

Always check login response and verify cookie was set!

### Mistake 3: Using different axios instances
```typescript
❌ axios.post('/auth/login', ...)       // Different instance
   api.get('/dashboard/stats', ...)     // Your configured instance
```

Always use the SAME axios instance (the one with `withCredentials: true`)!

---

## 📝 Checklist

Before reporting issues, verify:

- [ ] Configured axios with `withCredentials: true`
- [ ] Using `https://localhost:7262/api` (not 127.0.0.1)
- [ ] **Called login endpoint FIRST**
- [ ] Login returned 200 OK with user data
- [ ] Cookie `auth_token` is visible in DevTools after login
- [ ] Cookie is under `https://localhost:7262` domain
- [ ] Cookie has HttpOnly flag checked
- [ ] Making authenticated requests AFTER successful login
- [ ] Same axios instance for all requests

---

## 🎯 Quick Test (Copy-Paste Ready)

```typescript
// Quick test - paste in browser console
(async () => {
  // 1. Login
  const login = await api.post('/auth/login', {
    username: 'admin',
    password: 'admin1234'
  });
  console.log('Login:', login.data.success ? '✅' : '❌');
  
  // 2. Wait
  await new Promise(r => setTimeout(r, 500));
  
  // 3. Test auth
  const test = await api.get('/dashboard/stats');
  console.log('Auth:', test.status === 200 ? '✅' : '❌');
  console.log('Data:', test.data);
})();
```

---

## 🔍 Debug Information to Collect

If still failing, provide:

1. **Login request (Network tab):**
   - Status code
   - Response body
   - Response headers (especially `Set-Cookie`)

2. **Login response cookies (DevTools):**
   - Screenshot of Application → Cookies
   - Show `auth_token` cookie properties

3. **Authenticated request (Network tab):**
   - Request headers (check if Cookie header exists)
   - Status code
   - Response body

4. **Console output:**
   - Any errors during login
   - Any errors during authenticated request

---

## ✅ Expected Flow

```
Step 1: Login
POST https://localhost:7262/api/auth/login
→ Response: 200 OK
→ Response Header: Set-Cookie: auth_token=...
→ Browser saves cookie for https://localhost:7262

Step 2: Browser has cookie
Cookie stored: auth_token (HttpOnly, Secure, SameSite=Lax)

Step 3: Make authenticated request
GET https://localhost:7262/api/dashboard/stats
→ Request Header: Cookie: auth_token=...  ← Browser sends automatically!
→ Response: 200 OK with data
```

---

**TL;DR:** Login first, then check if cookie is set, THEN make authenticated requests! 🎯
