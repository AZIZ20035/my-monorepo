'use client';

import { useEffect, useState } from 'react';
import { usePeriodStore } from '@/store/use-period-store';
import { useCategoryStore } from '@/store/use-category-store';
import { useEidDayStore } from '@/store/use-eid-day-store';
import { Clock, Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DayPeriodResponse, EidDayPeriodResponse } from '@/dto/period.dto';

// Components
import { TemplateList } from './components/TemplateList';
import { AssignmentList } from './components/AssignmentList';
import { TemplateModal } from './components/TemplateModal';
import { AssignmentModal } from './components/AssignmentModal';
import { EditAssignmentModal } from './components/EditAssignmentModal';

type TabType = 'templates' | 'schedule';

export default function PeriodsPage() {
  const { fetchTemplates, fetchAssignments, isLoading } = usePeriodStore();
  const { fetchCategories } = useCategoryStore();
  const { fetchEidDays } = useEidDayStore();

  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DayPeriodResponse | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<EidDayPeriodResponse | null>(null);

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
    fetchEidDays();
    fetchAssignments();
  }, [fetchTemplates, fetchCategories, fetchEidDays, fetchAssignments]);

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsTemplateModalOpen(true);
  };

  const handleEditTemplate = (template: DayPeriodResponse) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(true);
  };

  const handleCreateAssignment = () => {
    setIsAssignModalOpen(true);
  };

  const handleEditAssignment = (assignment: EidDayPeriodResponse) => {
    setSelectedAssignment(assignment);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-6 lg:space-y-8 pb-4 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-[var(--secondary)] border border-[var(--border)] p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-sm shrink-0"
      >
        <div className="flex items-center gap-4 lg:gap-5">
          <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shadow-sm border border-[var(--primary)]/20 shrink-0">
            <Clock className="h-6 w-6 lg:h-7 lg:w-7" />
          </div>
          <div className="space-y-0.5 lg:space-y-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight">
              إدارة الفترات
            </h1>
            <p className="text-[var(--muted-foreground)] font-bold text-xs sm:text-sm lg:text-base">
              إدارة قوالب الفترات وتعيينها لأيام العيد
            </p>
          </div>
        </div>

        <Button
          onClick={activeTab === 'templates' ? handleCreateTemplate : handleCreateAssignment}
          className="h-11 lg:h-12 px-6 rounded-xl bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white font-black shadow-lg shadow-[#39ace7]/20 hover:shadow-[#39ace7]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="h-5 w-5 ml-2" />
          {activeTab === 'templates' ? 'قالب جديد' : 'تعيين جديد'}
        </Button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[var(--secondary)] border border-[var(--border)] p-2 rounded-2xl shrink-0">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 h-12 rounded-xl font-black text-sm transition-all ${
            activeTab === 'templates'
              ? 'bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white shadow-md'
              : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock size={18} />
            قوالب الفترات
          </div>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 h-12 rounded-xl font-black text-sm transition-all ${
            activeTab === 'schedule'
              ? 'bg-gradient-to-l from-[#0784b5] to-[#39ace7] text-white shadow-md'
              : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)]/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Calendar size={18} />
            الجدول التشغيلي
          </div>
        </button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 min-h-0 overflow-hidden"
      >
        <div className="h-full overflow-y-auto custom-scrollbar pb-6">
          {activeTab === 'templates' ? (
            <TemplateList onEdit={handleEditTemplate} />
          ) : (
            <AssignmentList onEdit={handleEditAssignment} />
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
      />

      <AssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />

      <EditAssignmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
      />
    </div>
  );
}
