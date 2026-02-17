import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/dto/user.dto';
import api from '@/lib/api-client';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      logout: async () => {
        try {
          // Call server-side logout to clear HttpOnly cookie
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          // Clear local state regardless of API success
          document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          localStorage.removeItem('user_role');
          localStorage.removeItem('user');
          
          set({ user: null, isAuthenticated: false });
          toast.success('تم تسجيل الخروج بنجاح', {
            description: 'نتمنى رؤيتك قريباً 👋',
          });
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      },
      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;
        if (user.role === 'admin') return true;
        return user.permissions.includes(permission);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
