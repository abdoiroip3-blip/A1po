import React from 'react';
import { FileText, ClipboardList, Plus, LayoutTemplate, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewNote: () => void;
  notesCount: number;
  clipsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onNewNote,
  notesCount,
  clipsCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 safe-bottom transition-colors">
      <div className="max-w-md mx-auto px-3 py-1 flex items-center justify-around relative">
        {/* Notes Tab */}
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
            activeTab === 'notes'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title="الملاحظات"
        >
          <div className="relative">
            <FileText className={`w-5 h-5 ${activeTab === 'notes' ? 'stroke-[2.5]' : ''}`} />
            {notesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {notesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1">الملاحظات</span>
        </button>

        {/* Clipboard Tab */}
        <button
          onClick={() => setActiveTab('clipboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
            activeTab === 'clipboard'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title="الحافظة"
        >
          <div className="relative">
            <ClipboardList className={`w-5 h-5 ${activeTab === 'clipboard' ? 'stroke-[2.5]' : ''}`} />
            {clipsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {clipsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1">الحافظة</span>
        </button>

        {/* Floating Action Button: New Note */}
        <div className="relative -top-3">
          <button
            onClick={onNewNote}
            className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            title="ملاحظة HTML جديدة"
            aria-label="ملاحظة HTML جديدة"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Templates Tab */}
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'templates'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title="القوالب"
        >
          <LayoutTemplate className={`w-5 h-5 ${activeTab === 'templates' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">القوالب</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
            activeTab === 'settings'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title="الإعدادات"
        >
          <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">الإعدادات</span>
        </button>
      </div>
    </nav>
  );
};
