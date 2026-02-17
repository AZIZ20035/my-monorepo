'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { userService } from '@/services/user-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  User, 
  Key, 
  ShieldCheck, 
  Settings as SettingsIcon,
  Save,
  Lock,
  UserCircle 
} from 'lucide-react';

export default function SettingsPage() {
  const { user, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedUser = await userService.updateProfile({ 
        id: user.id, 
        name: profileData.name 
      });
      setAuth(updatedUser);
      toast.success('تم تحديث البيانات الشخصية بنجاح');
    } catch (error: any) {
      toast.error('فشل تحديث البيانات', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('كلمات المرور الجديدة غير متطابقة');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsPasswordLoading(true);
    try {
      await userService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success('تم تغيير كلمة المرور بنجاح');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error('فشل تغيير كلمة المرور', {
        description: error.message
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-sm">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight">إعدادات الحساب</h1>
            <p className="text-sm font-medium text-[var(--muted-foreground)]">إدارة بياناتك الشخصية وإعدادات الأمان الخاصة بك</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Sidebar Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-[#0784b5] to-[#39ace7] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-[var(--primary)]/20 mb-4 ring-4 ring-[var(--background)]">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-black text-[var(--foreground)]">{user?.name}</h2>
              <p className="text-xs font-bold text-[var(--muted-foreground)] mt-1 tracking-wider uppercase">@{user?.username}</p>
              
              <div className="mt-6 w-full pt-6 border-t border-[var(--border)]">
                <div className="flex items-center justify-between text-xs font-bold mb-3">
                  <span className="text-[var(--muted-foreground)]">الدور الوظيفي</span>
                  <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">{user?.role === 'admin' ? 'مدير نظام' : user?.role === 'call_center' ? 'خدمة عملاء' : 'محلل بيانات'}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[var(--muted-foreground)]">حالة الحساب</span>
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    نشط حالياً
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0784b5] to-[#39ace7] rounded-3xl p-6 text-white shadow-xl shadow-[#0784b5]/30">
            <ShieldCheck className="h-8 w-8 mb-4 opacity-80" />
            <h3 className="font-black text-lg mb-2">أمان حسابك أولويتنا</h3>
            <p className="text-xs font-medium leading-relaxed opacity-90">نوصي بتغيير كلمة المرور بشكل دوري واستخدام كلمات مرور قوية لضمان حماية بيانات النظام.</p>
          </div>
        </motion.div>

        {/* Forms Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--secondary)] border border-[var(--border)] rounded-3xl p-6 lg:p-8 shadow-sm overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)] border border-[var(--border)]">
                <UserCircle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black text-[var(--foreground)]">المعلومات الشخصية</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--muted-foreground)] mr-1">اسم المستخدم (لا يمكن تغييره)</label>
                  <Input 
                    value={user?.username || ''}
                    disabled
                    className="h-12 rounded-xl bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)] font-bold opacity-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--muted-foreground)] mr-1">الاسم الكامل</label>
                  <Input 
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                    required
                    disabled={isLoading}
                    className="h-12 rounded-xl border-[var(--border)] focus:ring-[var(--primary)]/20 transition-all font-bold text-[var(--foreground)] bg-[var(--muted)]/50"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  className="h-12 px-8 rounded-xl bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-all font-black shadow-sm flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  حفظ التعديلات
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Change Password Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--secondary)] border border-[var(--border)] rounded-3xl p-6 lg:p-8 shadow-sm overflow-hidden relative group"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)] border border-[var(--border)]">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-black text-[var(--foreground)]">تغيير كلمة المرور</h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-[var(--muted-foreground)] mr-1">كلمة المرور الحالية</label>
                <div className="relative">
                  <Input 
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    disabled={isPasswordLoading}
                    className="h-12 rounded-xl border-[var(--border)] pl-10 focus:ring-amber-500/20 transition-all font-bold tracking-widest text-[var(--foreground)] bg-[var(--muted)]/50"
                  />
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--muted-foreground)] mr-1">كلمة المرور الجديدة</label>
                  <div className="relative">
                    <Input 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                      disabled={isPasswordLoading}
                      className="h-12 rounded-xl border-[var(--border)] pl-10 focus:ring-[var(--primary)]/20 transition-all font-bold tracking-widest text-[var(--foreground)] bg-[var(--muted)]/50"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[var(--muted-foreground)] mr-1">تأكيد كلمة المرور الجديدة</label>
                  <div className="relative">
                    <Input 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                      disabled={isPasswordLoading}
                      className="h-12 rounded-xl border-[var(--border)] pl-10 focus:ring-[var(--primary)]/20 transition-all font-bold tracking-widest text-[var(--foreground)] bg-[var(--muted)]/50"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  isLoading={isPasswordLoading}
                  className="h-12 px-8 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all font-black shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  تحديث كلمة المرور
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
