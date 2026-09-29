import React, { useState } from 'react';
import { Pin, Download, Copy, Check, Trash2, Edit3, MoreVertical, Star, Calendar } from 'lucide-react';
import { Note } from '../types';
import { stripHtml, exportToHtmlFile, copyRichHtml } from '../utils/htmlUtils';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  categoryLabel?: string;
  isTrashView?: boolean;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onTogglePin,
  onToggleFavorite,
  onDelete,
  categoryLabel,
  isTrashView = false,
  onRestore,
  onPermanentDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const plainExcerpt = stripHtml(note.htmlContent).slice(0, 140);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyRichHtml(note.htmlContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    exportToHtmlFile(note.title, note.htmlContent);
  };

  const formattedDate = new Date(note.updatedAt).toLocaleDateString('ar-EG', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={() => !isTrashView && onEdit(note)}
      className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
        note.isPinned
          ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {categoryLabel && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {categoryLabel}
            </span>
          )}
          {note.isPinned && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded-full">
              <Pin className="w-2.5 h-2.5" /> مثبت
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!isTrashView ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  note.isPinned
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
                title={note.isPinned ? 'إلغاء التثبيت' : 'تثبيت في الأعلى'}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(note.id);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  note.isFavorite
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-slate-400 hover:text-amber-500'
                }`}
                title={note.isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              >
                <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-current' : ''}`} />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* Note Title */}
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 line-clamp-2 leading-snug">
        {note.title || 'ملاحظة بدون عنوان'}
      </h3>

      {/* Note Preview Excerpt */}
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-3 leading-relaxed">
        {plainExcerpt || 'لا يوجد محتوى نصي...'}
      </p>

      {/* Bottom Action Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-mono">
            HTML
          </span>
        </div>

        {isTrashView ? (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRestore?.(note.id);
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              استعادة
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPermanentDelete?.(note.id);
              }}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              حذف نهائي
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="نسخ محتوى HTML"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="تحميل كملف HTML مستقل"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="حذف إلى السلة"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
