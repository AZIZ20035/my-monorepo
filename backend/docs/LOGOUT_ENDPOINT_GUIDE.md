# 🚪 Logout Endpoint - Frontend Implementation Guide

**Date:** February 8, 2026  
**Status:** ✅ Implemented and Ready to Use

---

## 📋 Endpoint Details

### Logout User

**Endpoint:** `POST /api/auth/logout`  
**Authorization:** Required (must be logged in)  
**Purpose:** Logout current user and clear authentication cookie

---

## 🔧 Technical Specifications

### Request

**Method:** `POST`  
**URL:** `/api/auth/logout`  
**Headers:** No special headers needed (cookie sent automatically)  
**Body:** None (empty body)

### Response

**Status:** `200 OK`

**Success Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح",
  "data": null
}
```

**What Happens:**
1. Server deletes the `auth_token` cookie
2. Subsequent requests will return `401 Unauthorized`
3. User must login again to access protected endpoints

---

## 💻 Frontend Implementation

### Axios Example

```typescript
// Simple logout function
async function logout() {
  try {
    const response = await api.post('/auth/logout');
    
    if (response.data.success) {
      // Clear any local user data
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
      // OR using router: router.push('/login');
    }
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Even if API fails, clear local data and redirect
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
```

### Fetch API Example

```typescript
async function logout() {
  try {
    const response = await fetch('http://your-api-url/api/auth/logout', {
      method: 'POST',
      credentials: 'include'  // REQUIRED: Sends cookie
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout failed:', error);
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
```

### React Component Example

```typescript
import { useNavigate } from 'react-router-dom';
import api from './services/api';

function LogoutButton() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      await api.post('/auth/logout');
      
      // Clear user data
      localStorage.removeItem('user');
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear and redirect even on error
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

---

## 🧪 Testing Instructions

### Manual Test Steps

1. **Login first:**
   ```bash
   POST /api/auth/login
   Body: {"username": "admin", "password": "admin1234"}
   ```

2. **Verify authentication works:**
   ```bash
   GET /api/auth/me
   # Should return user data
   ```

3. **Call logout:**
   ```bash
   POST /api/auth/logout
   # Should return success message
   ```

4. **Verify logout worked:**
   ```bash
   GET /api/auth/me
   # Should return 401 Unauthorized
   ```

### Browser DevTools Test

1. Login to your app
2. Open DevTools → Application → Cookies
3. You should see `auth_token` cookie
4. Click logout button
5. Check cookies again - `auth_token` should be deleted
6. Try accessing protected page - should redirect to login

---

## ⚠️ Important Notes

### What Frontend MUST Do

1. **Call the logout API:** Don't just clear localStorage - you MUST call the API to clear the server cookie
2. **Clear local data:** Remove any user data from localStorage/sessionStorage
3. **Redirect to login:** Send user to login page after logout
4. **Handle errors gracefully:** Even if API fails, still clear local data and redirect

### What Happens Automatically

✅ Cookie is deleted by server  
✅ Token is invalidated  
✅ Browser removes cookie automatically  

### What Does NOT Happen Automatically

❌ localStorage is NOT cleared (you must do this)  
❌ User is NOT redirected (you must do this)  
❌ UI state is NOT reset (you must do this)

---

## 🔄 Complete Authentication Flow

### Login Flow
```
User enters credentials
    ↓
POST /api/auth/login
    ↓
Server sets auth_token cookie
    ↓
Store user data in localStorage
    ↓
Redirect to dashboard
```

### Logout Flow
```
User clicks logout button
    ↓
POST /api/auth/logout
    ↓
Server deletes auth_token cookie
    ↓
Clear localStorage
    ↓
Redirect to login page
```

---

## 🐛 Common Issues & Solutions

### Issue: "Still logged in after logout"
**Cause:** Not calling the logout API, only clearing localStorage  
**Fix:** Always call `POST /api/auth/logout` before redirecting

### Issue: "401 error when calling logout"
**Cause:** User is already logged out (cookie expired/deleted)  
**Fix:** Handle 401 gracefully - still clear local data and redirect

### Issue: "Cookie not deleted"
**Cause:** Not using `withCredentials: true` in axios  
**Fix:** Ensure axios is configured correctly:
```typescript
axios.defaults.withCredentials = true;
```

### Issue: "CORS error on logout"
**Cause:** Frontend URL not in backend's AllowedOrigins  
**Fix:** Contact backend team to add your URL to `appsettings.json`

---

## 📊 Error Handling

### Possible Responses

| Status | Scenario | Action |
|--------|----------|--------|
| 200 | Logout successful | Clear local data, redirect to login |
| 401 | Already logged out | Clear local data, redirect to login |
| 500 | Server error | Log error, clear local data, redirect to login |

### Best Practice Error Handler

```typescript
async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Logout endpoint might fail if already logged out
    // This is OK - we still want to clear local state
    console.warn('Logout API call failed, clearing local state anyway', error);
  } finally {
    // ALWAYS do these regardless of API success/failure
    localStorage.removeItem('user');
    sessionStorage.clear(); // If you use sessionStorage
    window.location.href = '/login';
  }
}
```

---

## 🎯 Quick Reference

**Endpoint:** `POST /api/auth/logout`  
**Auth Required:** Yes (but fails gracefully if not authenticated)  
**Request Body:** None  
**Success Response:** `{ success: true, message: "تم تسجيل الخروج بنجاح" }`  
**Cookie Behavior:** Server deletes `auth_token` cookie  
**Frontend Actions:** Clear localStorage + redirect to login  

---

## ✅ Implementation Checklist

- [ ] Add logout function to auth service
- [ ] Call `POST /api/auth/logout` endpoint
- [ ] Clear `localStorage.removeItem('user')`
- [ ] Clear any other auth-related state (Redux, Zustand, etc.)
- [ ] Redirect to login page after logout
- [ ] Handle errors gracefully (still logout locally if API fails)
- [ ] Test logout flow in browser
- [ ] Verify cookie is deleted in DevTools
- [ ] Verify protected pages are inaccessible after logout
- [ ] Test multiple logout clicks (shouldn't cause errors)

---

## 🔗 Related Endpoints

- `POST /api/auth/login` - Login and receive cookie
- `GET /api/auth/me` - Get current user (verify authentication)
- `POST /api/auth/change-password` - Change password

---

## 📞 Need Help?

**Backend is ready!** The logout endpoint is fully implemented and tested.

If you have issues:
1. Ensure `withCredentials: true` in axios config
2. Check browser console for CORS errors
3. Verify your frontend URL is in backend's AllowedOrigins
4. Contact backend team with specific error messages

---

**Implementation Time:** 10-15 minutes  
**Difficulty:** Easy ⭐  
**Status:** Ready to use immediately ✅

Good luck! 🚀
