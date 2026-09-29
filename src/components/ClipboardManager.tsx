import React, { useState } from 'react';
import {
  Clipboard,
  ClipboardPaste,
  Plus,
  Copy,
  Check,
  Pin,
  Trash2,
  FilePlus2,
  Search,
  Code,
  Link as LinkIcon,
  Mail,
  Palette,
  FileText,
  Filter,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ClipItem, ClipType } from '../types';
import { detectContentType, copyRichHtml } from '../utils/htmlUtils';

interface ClipboardManagerProps {
  clips: ClipItem[];
  onAddClip: (clip: Omit<ClipItem, 'id' | 'createdAt'>) => void;
  onDeleteClip: (id: string) => void;
  onTogglePin: (id: string) => void;
  onClearAll: () => void;
  onCreateNoteFromClip: (content: string, title?: string) => void;
}

export const ClipboardManager: React.FC<ClipboardManagerProps> = ({
  clips,
  onAddClip,
  onDeleteClip,
  onTogglePin,
  onClearAll,
  onCreateNoteFromClip,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);

  // Fast paste from device clipboard
  const handlePasteFromSystem = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        setPasteError('المتصفح لا يدعم القراءة المباشرة، يمكنك اللصق يدوياً.');
        setTimeout(() => setPasteError(null), 3000);
        setShowAddModal(true);
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        setPasteError('حافظة الجهاز فارغة حالياً!');
        setTimeout(() => setPasteError(null), 2500);
        return;
      }

      const type = detectContentType(text);
      const title = text.slice(0, 30).trim() || 'قصاصة جديدة';
      onAddClip({
        title,
        content: text,
        type,
        isPinned: false,
        tags: [],
      });
    } catch (err) {
      console.warn('Clipboard read failed', err);
      // Open modal for manual paste if permission blocked
      setShowAddModal(true);
    }
  };

  const handleCopyClip = async (clip: ClipItem) => {
    const success = await copyRichHtml(clip.content);
    if (success) {
      setCopiedId(clip.id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  const handleSaveManualClip = () => {
    if (!newContent.trim()) return;
    const type = detectContentType(newContent);
    onAddClip({
      title: newTitle.trim() || newContent.slice(0, 30).trim(),
      content: newContent,
      type,
      isPinned: false,
      tags: [],
    });
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  // Filter clips
  const filteredClips = clips.filter((c) => {
    const matchesSearch =
      c.content.toLowerCase().includes(search.toLowerCase()) ||
      (c.title && c.title.toLowerCase().includes(search.toLowerCase()));
    const matchesType = selectedType === 'all' || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Sort pinned first, then newest
  const sortedClips = [...filteredClips].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt - a.createdAt;
  });

  const getTypeIcon = (type: ClipType) => {
    switch (type) {
      case 'html':
        return <Code className="w-3.5 h-3.5 text-blue-500" />;
      case 'link':
        return <LinkIcon className="w-3.5 h-3.5 text-emerald-500" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-purple-500" />;
      case 'color':
        return <Palette className="w-3.5 h-3.5 text-rose-500" />;
      case 'code':
        return <Code className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Action Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-3">
        {/* Quick Paste & Add Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePasteFromSystem}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all"
          >
            <ClipboardPaste className="w-4 h-4" />
            <span>لصق من حافظة الهاتف</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs border border-slate-200/80 dark:border-slate-700 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قصاصة يدوية</span>
          </button>
        </div>

        {pasteError && (
          <div className="p-2 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-lg text-center">
            {pasteError}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث في القصاصات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border-0 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs pb-0.5">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'html', label: 'HTML' },
            { id: 'text', label: 'نصوص' },
            { id: 'link', label: 'روابط' },
            { id: 'code', label: 'أكواد' },
            { id: 'email', label: 'بريد' },
            { id: 'color', label: 'ألوان' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
                selectedType === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clips List */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>{sortedClips.length} قصاصة محفوظة</span>
          {clips.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-rose-600 dark:text-rose-400 hover:underline text-[11px]"
            >
              مسح الكل
            </button>
          )}
        </div>

        {sortedClips.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clipboard className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
              لا توجد قصاصات في الحافظة
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              اضغط على زر &quot;لصق من حافظة الهاتف&quot; أو أضف نصوص وأكواد HTML للاحتفاظ بها هنا.
            </p>
          </div>
        ) : (
          sortedClips.map((clip) => {
            const isCopied = copiedId === clip.id;
            return (
              <div
                key={clip.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-3.5 transition-all shadow-sm ${
                  clip.isPinned
                    ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                      {getTypeIcon(clip.type)}
                    </span>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {clip.title || clip.content.slice(0, 25)}
                    </span>
                    {clip.isPinned && (
                      <span className="text-[10px] text-amber-600 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.2 rounded-full font-semibold">
                        مثبت
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(clip.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        clip.isPinned
                          ? 'text-amber-600 bg-amber-100/50 dark:bg-amber-900/30'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={clip.isPinned ? 'إلغاء التثبيت' : 'تثبيت في الأعلى'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteClip(clip.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="حذف القصاصة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Box */}
                <div
                  className={`p-2.5 rounded-xl text-xs font-mono mb-2.5 overflow-x-auto max-h-32 border ${
                    clip.type === 'color'
                      ? 'flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                  style={{ direction: clip.type === 'text' ? 'rtl' : 'ltr', textAlign: clip.type === 'text' ? 'right' : 'left' }}
                >
                  {clip.type === 'color' && (
                    <span
                      className="w-5 h-5 rounded border border-slate-300 shadow-xs shrink-0"
                      style={{ backgroundColor: clip.content }}
                    />
                  )}
                  <span className="break-all whitespace-pre-wrap">{clip.content}</span>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400">
                    {new Date(clip.createdAt).toLocaleDateString('ar-EG', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Convert to HTML Note */}
                    <button
                      onClick={() => onCreateNoteFromClip(clip.content, clip.title)}
                      className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg text-[11px] font-medium transition-colors"
                      title="إنشاء ملاحظة HTML جديدة من هذه القصاصة"
                    >
                      <FilePlus2 className="w-3.5 h-3.5" />
                      <span>تحويل لملاحظة</span>
                    </button>

                    {/* Instant Copy Button */}
                    <button
                      onClick={() => handleCopyClip(clip)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold transition-all shadow-xs ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Add Clip Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3">
              إضافة قصاصة جديدة إلى الحافظة
            </h3>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="عنوان أو وصف للقصاصة (اختياري)..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs p-3 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                rows={4}
                placeholder="الصق أو اكتب النص، الرابط، أو كود HTML هنا..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full text-xs p-3 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500 font-mono resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveManualClip}
                disabled={!newContent.trim()}
                className="px-4 py-2 text-xs font-bold bg-blue-600 disabled:opacity-50 text-white rounded-xl hover:bg-blue-700 shadow-sm"
              >
                حفظ في الحافظة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
