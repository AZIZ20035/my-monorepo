import api from '@/lib/api-client';
import { User, UserDto, ApiUser, LoginResponse, CreateUserRequest, UpdateUserRequest } from '@/dto/user.dto';
import { ApiResponse } from '@/dto/api-response.dto';

export const userService = {
  login: async (username: string, password: string): Promise<{ user: User }> => {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
      username,
      password,
    });

    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تسجيل الدخول');
    }

    return {
      user: UserDto.fromApi(data.data.user),
    };
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<ApiUser>>('/auth/me');
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل استرجاع البيانات');
    }

    return UserDto.fromApi(data.data);
  },

  updateProfile: async (user: Partial<User>): Promise<User> => {
    const apiData = UserDto.toApi(user);
    const { data } = await api.put<ApiResponse<ApiUser>>(`/users/${user.id}`, apiData);
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحديث البيانات');
    }

    return UserDto.fromApi(data.data);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const { data } = await api.post<ApiResponse<null>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });

    if (!data.success) {
      throw new Error(data.message || 'فشل تغيير كلمة المرور');
    }
  },
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await api.get<ApiResponse<ApiUser[]>>('/users');
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل استرجاع قائمة المستخدمين');
    }

    return data.data.map(UserDto.fromApi);
  },

  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const { data } = await api.post<ApiResponse<ApiUser>>('/users', userData);
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل إنشاء المستخدم');
    }

    return UserDto.fromApi(data.data);
  },

  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const { data } = await api.put<ApiResponse<ApiUser>>(`/users/${id}`, userData);
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'فشل تحديث المستخدم');
    }

    return UserDto.fromApi(data.data);
  },

  deleteUser: async (id: string): Promise<void> => {
    const { data } = await api.delete<ApiResponse<null>>(`/users/${id}`);
    
    if (!data.success) {
      throw new Error(data.message || 'فشل حذف المستخدم');
    }
  },

  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    const { data } = await api.post<ApiResponse<null>>(`/users/${id}/reset-password`, JSON.stringify(newPassword));
    
    if (!data.success) {
      throw new Error(data.message || 'فشل إعادة تعيين كلمة المرور');
    }
  },
};

