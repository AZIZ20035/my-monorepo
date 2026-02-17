'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LoginRole, roleConfig } from './types';

interface RoleSelectionGridProps {
  selectedRole: LoginRole;
  onRoleChange: (role: LoginRole) => void;
}

export function RoleSelectionGrid({ selectedRole, onRoleChange }: RoleSelectionGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
      {(Object.keys(roleConfig) as LoginRole[]).map((r) => {
        const config = roleConfig[r];
        const RoleIcon = config.icon;
        const isActive = selectedRole === r;

        return (
          <motion.button
            key={r}
            type="button"
            onClick={() => onRoleChange(r)}
            className={`group relative flex flex-col items-center gap-3 rounded-2xl p-4 transition-all duration-300 border-2 ${
              isActive
                ? `bg-[var(--background)] ${config.borderColor} shadow-xl shadow-[#0784b5]/10`
                : 'bg-[var(--secondary)]/40 border-transparent hover:border-[var(--border)] hover:bg-[var(--secondary)]/60'
            }`}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glass Background for Active State */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-bl ${config.gradient} shadow-lg shadow-[#0784b5]/20 group-hover:scale-110 transition-transform duration-300`}>
              <RoleIcon size={24} className="text-white" />
            </div>
            
            <div className="text-center relative z-10">
              <h4 className={`text-sm font-black tracking-tight transition-colors duration-300 ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]'}`}>
                {r === 'admin' ? 'مدير' : r === 'call_center' ? 'موظف' : 'مراجع'}
              </h4>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-1 font-bold leading-tight opacity-70">
                  {r === 'admin' ? 'إدارة النظام' : r === 'call_center' ? 'استقبال طلبات' : 'مراجعة الطلبات'}
                </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
