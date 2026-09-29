import React, { useState } from 'react';
import { Search, X, Smartphone, Monitor, Trash2, ArrowRight } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
  trashCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  isPhoneFrame,
  setIsPhoneFrame,
  trashCount,
}) => {
  const [showSearch, setShowSearch] = useState(false);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'notes':
        return 'ملاحظاتي';
      case 'clipboard':
        return 'الحافظة الذكية';
      case 'editor':
        return 'محرر HTML';
      case 'templates':
        return 'قوالب HTML';
      case 'trash':
        return 'سلة المحذوفات';
      case 'settings':
        return 'الإعدادات';
      default:
        return 'حافظة وملاحظات HTML';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 safe-top transition-colors">
      <div className="max-w-md mx-auto px-4 py-2.5">
        {showSearch ? (
          <div className="flex items-center gap-2 animate-fadeIn">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="ابحث في العناوين أو كود HTML أو الوسوم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-9 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-full text-sm border-0 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 px-2 py-1"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {activeTab === 'trash' ? (
                <button
                  onClick={() => setActiveTab('notes')}
                  className="p-1.5 -mr-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="العودة للملاحظات"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-base">
                  H
                </div>
              )}

              <div>
                <h1 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                  {getTabTitle()}
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                  {activeTab === 'clipboard'
                    ? 'إدارة القصاصات والنصوص'
                    : activeTab === 'editor'
                    ? 'كتابة وتنسيق الملاحظات'
                    : 'بصيغة HTML للجوال'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {activeTab === 'notes' && (
                <>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    title="بحث"
                    aria-label="بحث"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('trash')}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
                    title="سلة المحذوفات"
                    aria-label="سلة المحذوفات"
                  >
                    <Trash2 className="w-4 h-4" />
                    {trashCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                    )}
                  </button>
                </>
              )}

              {/* Toggle phone frame for desktop viewing convenience */}
              <button
                onClick={() => setIsPhoneFrame(!isPhoneFrame)}
                className="hidden md:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                title={isPhoneFrame ? 'عرض الشاشة الكاملة' : 'عرض إطار الهاتف الذكي'}
              >
                {isPhoneFrame ? (
                  <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Smartphone className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
