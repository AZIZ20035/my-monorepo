'use client';

import { useEffect, useState } from 'react';
import { useAreaStore } from '@/store/use-area-store';
import { AreaTable } from './components/AreaTable';
import { AreaCards } from './components/AreaCards';
import { AreaModal } from './components/AreaModal';
import { Area } from '@/dto/area.dto';
import { 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  Search, 
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export default function AreasPage() {
  const { areas, fetchAreas, isLoading } = useAreaStore();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const filteredAreas = areas.filter(area => 
    area.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (area.nameEn && area.nameEn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedArea(null);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col gap-6 p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-black text-[var(--foreground)] flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <MapPin size={24} />
            </div>
            إدارة الأحياء والمناطق
          </h1>
          <p className="text-[var(--muted-foreground)] font-bold text-sm lg:text-base mr-13">
            قم بإضافة وإدارة الأحياء وتحديد تكلفة التوصيل لكل منطقة
          </p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button 
            onClick={fetchAreas}
            variant="ghost" 
            size="icon"
            disabled={isLoading}
            className="h-11 w-11 rounded-xl bg-[var(--muted)]/50 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            onClick={handleAdd}
            className="h-11 px-6 rounded-xl bg-gradient-to-tr from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#0784b5]/20 hover:scale-[1.02] transition-transform flex items-center gap-2"
          >
            <Plus size={18} />
            إضافة حي جديد
          </Button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--secondary)] p-4 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="البحث عن حي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 pr-10 rounded-xl border-[var(--border)] bg-[var(--background)] font-bold focus:ring-[var(--primary)]/20 transition-all"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
        </div>

        <div className="flex items-center gap-1 bg-[var(--background)] p-1 rounded-xl border border-[var(--border)] w-full sm:w-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 rounded-lg font-black text-xs transition-all ${
              viewMode === 'table' 
                ? 'bg-[var(--primary)] text-white shadow-md' 
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
            }`}
          >
            <TableIcon size={14} />
            جدول
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-4 rounded-lg font-black text-xs transition-all ${
              viewMode === 'cards' 
                ? 'bg-[var(--primary)] text-white shadow-md' 
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
            }`}
          >
            <LayoutGrid size={14} />
            بطاقات
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <AreaTable areas={filteredAreas} onEdit={handleEdit} />
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full overflow-y-auto pr-2 custom-scrollbar"
            >
              <AreaCards areas={filteredAreas} onEdit={handleEdit} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AreaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        area={selectedArea} 
      />
    </div>
  );
}
