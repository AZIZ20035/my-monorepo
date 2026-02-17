export type UserRole = 'admin' | 'call_center' | 'order_reviewer';

export interface ApiUser {
  userId: number;
  username: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string;
  createdAt?: string;
  permissions?: string[];
}

export interface CreateUserRequest {
  username: string;
  password?: string;
  fullName: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  fullName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface LoginResponse {
  user: ApiUser;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  permissions: string[];
}

export class UserDto {
  static fromApi(apiUser: ApiUser): User {
    return {
      id: apiUser.userId.toString(),
      name: apiUser.fullName,
      username: apiUser.username,
      avatar: apiUser.avatarUrl,
      role: apiUser.role,
      isActive: apiUser.isActive,
      createdAt: apiUser.createdAt ? new Date(apiUser.createdAt) : undefined,
      permissions: apiUser.permissions || [],
    };
  }

  static toApi(user: Partial<User>): Partial<ApiUser> {
    return {
      userId: user.id ? parseInt(user.id) : undefined,
      fullName: user.name,
      username: user.username,
      avatarUrl: user.avatar,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt?.toISOString(),
      permissions: user.permissions,
    };
  }
}
