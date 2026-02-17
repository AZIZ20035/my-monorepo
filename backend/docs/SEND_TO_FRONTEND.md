# 📧 MESSAGE FOR FRONTEND DEVELOPER

Hi Frontend Team,

The backend authentication has been updated to use **HTTP-only cookies** instead of bearer tokens for better security.

---

## 🎯 What You Need to Do

**Read this document:** `docs/FRONTEND_INSTRUCTIONS.md`

It contains:
- ✅ Step-by-step setup instructions (10 minutes)
- ✅ Complete code examples (copy-paste ready)
- ✅ React and Vue examples
- ✅ Testing instructions

---

## ⚡ Quick Summary

### 1. Configure Axios (One Time):
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7262/api',  // Use "localhost", not "127.0.0.1"!
  withCredentials: true                    // Required for cookies!
});

export default api;
```

### 2. Update Login Function:
```typescript
async function login(username, password) {
  const response = await api.post('/auth/login', { username, password });
  
  // Store user data (NOT token - it's in a secure cookie)
  localStorage.setItem('user', JSON.stringify(response.data.data.user));
  
  return response.data.data.user;
}
```

### 3. That's It!
After login, ALL requests automatically include the authentication cookie. No need to manage tokens!

```typescript
// Just make requests - cookie is sent automatically!
await api.get('/dashboard/stats');
await api.get('/orders');
await api.post('/orders', orderData);
```

---

## 🔒 Security Benefits

- ✅ JavaScript cannot access the token (XSS protection)
- ✅ Automatic cookie management by browser
- ✅ Simpler code - no token management needed
- ✅ More secure than localStorage tokens

---

## 📝 Test Credentials

**Admin User:**
- Username: `admin`
- Password: `admin1234`
- Role: `admin` (full system access)

**Call Center User:**
- Username: `user`
- Password: `user1234`
- Role: `call_center` (normal user access)

---

## 🆘 Important Notes

1. **Use `localhost`, NOT `127.0.0.1`** - Cookies don't work across domains
2. **Must have `withCredentials: true`** - Required for cookie authentication
3. **Login first** - Cookie only exists after successful login
4. **No token in response** - It's in a secure HTTP-only cookie

---

## 📚 Documentation

**Main Guide:** `docs/FRONTEND_INSTRUCTIONS.md` ⭐

**Additional Help:**
- `docs/USER_ROLES.md` - Understanding user roles & permissions
- `docs/FRONTEND_TESTING_STEPS.md` - How to test step-by-step
- `docs/COOKIE_401_TROUBLESHOOTING.md` - Fix 401 errors
- `docs/FRONTEND_COOKIE_AUTH_GUIDE.md` - Complete technical details

---

## ✅ Quick Checklist

- [ ] Configure axios with `withCredentials: true`
- [ ] Use `https://localhost:7262/api` (not 127.0.0.1)
- [ ] Update login to store user data only (not token)
- [ ] Update logout to call `/auth/logout` endpoint
- [ ] Remove old token management code
- [ ] Test login → check cookie in DevTools
- [ ] Test authenticated requests work

---

**Questions?** Check the documentation or contact the backend team.

**Backend URL:** `https://localhost:7262/api`

---

Good luck! The new authentication system is actually simpler than the old one. 🚀
