import React, { useState } from 'react';
import { LayoutTemplate, Sparkles, Check, ArrowRight, Eye } from 'lucide-react';
import { HTML_TEMPLATES } from '../utils/storage';

interface TemplatesModalProps {
  onSelectTemplate: (title: string, content: string, category: string) => void;
  onClose: () => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  onSelectTemplate,
  onClose,
}) => {
  const [previewId, setPreviewId] = useState<string | null>(HTML_TEMPLATES[0].id);

  const selectedTemplate = HTML_TEMPLATES.find((t) => t.id === previewId) || HTML_TEMPLATES[0];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between safe-top">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              قوالب HTML جاهزة
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختر قالباً جاهزاً ومصمماً لتسريع كتابتك
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-2.5">
          {HTML_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => setPreviewId(tmpl.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                previewId === tmpl.id
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/30 shadow-xs ring-1 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {tmpl.title}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                  {tmpl.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {tmpl.description}
              </p>
              <div className="flex items-center justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(tmpl.title, tmpl.content, tmpl.category);
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  استخدام القالب
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Template Preview Container */}
        {selectedTemplate && (
          <div className="mt-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                معاينة: {selectedTemplate.title}
              </span>
              <button
                onClick={() =>
                  onSelectTemplate(
                    selectedTemplate.title,
                    selectedTemplate.content,
                    selectedTemplate.category
                  )
                }
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                تطبيق الآن ←
              </button>
            </div>
            <div
              className="html-preview-content text-xs text-slate-800 dark:text-slate-200 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
