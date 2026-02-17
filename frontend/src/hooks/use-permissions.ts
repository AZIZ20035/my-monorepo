import { useAuthStore } from '@/store/use-auth-store';

/**
 * Hook to check if the current user has specific permissions or roles.
 */
export function usePermissions() {
  const { user, hasPermission, isAuthenticated } = useAuthStore();

  return {
    isAuthenticated,
    user,
    can: (permission: string) => hasPermission(permission),
    isAdmin: user?.role === 'admin',
    isCallCenter: user?.role === 'call_center',
    isOrderReviewer: user?.role === 'order_reviewer',
    isGuest: !isAuthenticated,
  };
}
