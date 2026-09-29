import React, { useRef, useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  BookOpen,
  Download,
  Upload,
  FileCode,
  RotateCcw,
  Check,
  ShieldCheck,
  Smartphone,
  Globe,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { exportAllDataBackup, importDataBackup } from '../utils/storage';

interface SettingsModalProps {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
  notesCount: number;
  clipsCount: number;
  onImportHtmlFile: (title: string, htmlContent: string) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  theme,
  setTheme,
  isPhoneFrame,
  setIsPhoneFrame,
  notesCount,
  clipsCount,
  onImportHtmlFile,
  onResetData,
}) => {
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const jsonInputRef = useRef<HTMLInputElement>(null);
  const htmlInputRef = useRef<HTMLInputElement>(null);

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const ok = importDataBackup(text);
        if (ok) {
          setImportSuccess(true);
          setTimeout(() => {
            setImportSuccess(false);
            window.location.reload();
          }, 1500);
        } else {
          setImportError('ملف النسخة الاحتياطية غير صالح');
          setTimeout(() => setImportError(null), 3000);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const title = file.name.replace(/\.[^/.]+$/, '');
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportHtmlFile(title, content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 safe-top">
        <h2 className="font-bold text-base text-slate-900 dark:text-white">
          الإعدادات والنسخ الاحتياطي
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          تخصيص المظهر وإدارة البيانات وتصدير الملفات
        </p>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto text-xs">
        {/* Status Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-sm mb-1">حافظة وملاحظات HTML للجوال</h3>
          <p className="text-[11px] opacity-90 mb-3">
            تطبيق سريع وآمن، يعمل دون الحاجة لخوادم خارجية ويحفظ بياناتك محلياً على جهازك.
          </p>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white/15 rounded-xl p-2">
              <span className="block text-lg font-bold">{notesCount}</span>
              <span className="text-[10px] opacity-80">ملاحظة HTML</span>
            </div>
            <div className="bg-white/15 rounded-xl p-2">
              <span className="block text-lg font-bold">{clipsCount}</span>
              <span className="text-[10px] opacity-80">قصاصة حافظة</span>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">المظهر والسمة</h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                theme === 'light'
                  ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span className="text-[11px]">نهاري</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-950/50 text-blue-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span className="text-[11px]">داكن</span>
            </button>

            <button
              onClick={() => setTheme('sepia')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                theme === 'sepia'
                  ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[11px]">قراءة دافئ</span>
            </button>
          </div>

          {/* Desktop Phone Mockup Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700 dark:text-slate-300">
                إطار الهاتف الذكي (للشاشات الكبيرة)
              </span>
            </div>
            <input
              type="checkbox"
              checked={isPhoneFrame}
              onChange={(e) => setIsPhoneFrame(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>
        </div>

        {/* Data & Files Management */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs">
            إدارة الملفات والنسخ الاحتياطي
          </h4>

          {importSuccess && (
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl text-center text-xs flex items-center justify-center gap-1">
              <Check className="w-4 h-4" />
              تم استيراد البيانات بنجاح!
            </div>
          )}

          {importError && (
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl text-center text-xs">
              {importError}
            </div>
          )}

          {/* Import existing HTML file */}
          <button
            onClick={() => htmlInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-500" />
              <div className="text-right">
                <span className="font-bold block">استيراد ملف HTML من الهاتف</span>
                <span className="text-[10px] text-slate-400">
                  فتح ملف .html وتعديله أو حفظه كملاحظة
                </span>
              </div>
            </div>
            <Upload className="w-4 h-4 text-slate-400" />
          </button>
          <input
            ref={htmlInputRef}
            type="file"
            accept=".html,.htm,.txt"
            onChange={handleHtmlFileUpload}
            className="hidden"
          />

          {/* Export JSON backup */}
          <button
            onClick={exportAllDataBackup}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-500" />
              <div className="text-right">
                <span className="font-bold block">تصدير نسخة احتياطية كاملة (JSON)</span>
                <span className="text-[10px] text-slate-400">
                  حفظ كافة الملاحظات وقصاصات الحافظة
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          {/* Import JSON backup */}
          <button
            onClick={() => jsonInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-500" />
              <div className="text-right">
                <span className="font-bold block">استرجاع نسخة احتياطية</span>
                <span className="text-[10px] text-slate-400">
                  رفع ملف backup JSON سابق
                </span>
              </div>
            </div>
            <Upload className="w-4 h-4 text-slate-400" />
          </button>
          <input
            ref={jsonInputRef}
            type="file"
            accept=".json"
            onChange={handleJsonUpload}
            className="hidden"
          />
        </div>

        {/* Reset Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (
                window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين البيانات للوضع الافتراضي؟')
              ) {
                onResetData();
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 p-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>استعادة البيانات الافتراضية التجريبية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
