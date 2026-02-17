import { create } from 'zustand';
import { User, CreateUserRequest, UpdateUserRequest } from '@/dto/user.dto';
import { userService } from '@/services/user-service';
import { toast } from 'sonner';
import { useAuthStore } from './use-auth-store';

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  resetPassword: (id: string, newPassword: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.getAllUsers();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('خطأ في تحميل المستخدمين', {
        description: error.message,
      });
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await userService.createUser(userData);
      set((state) => ({ 
        users: [...state.users, newUser],
        isLoading: false 
      }));
      toast.success('تم إنشاء المستخدم بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إنشاء المستخدم', {
        description: error.message,
      });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userService.updateUser(id, userData);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        isLoading: false,
      }));

      // Sync auth store if the updated user is the current logged-in user
      const authUser = useAuthStore.getState().user;
      if (authUser && authUser.id === id) {
        useAuthStore.getState().setAuth(updatedUser);
      }

      toast.success('تم تحديث بيانات المستخدم بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تحديث المستخدم', {
        description: error.message,
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userService.deleteUser(id);
      set((state) => ({
        users: state.users.map((u) => 
          u.id === id ? { ...u, isActive: false } : u
        ),
        isLoading: false,
      }));
      toast.success('تم تعطيل المستخدم بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل تعطيل المستخدم', {
        description: error.message,
      });
    }
  },

  resetPassword: async (id, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await userService.resetPassword(id, newPassword);
      set({ isLoading: false });
      toast.success('تم إعادة تعيين كلمة المرور بنجاح');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('فشل إعادة تعيين كلمة المرور', {
        description: error.message,
      });
      throw error;
    }
  },
}));
