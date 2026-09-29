import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Save,
  Download,
  Copy,
  Check,
  Eye,
  Code2,
  Edit3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Sparkles,
  ClipboardPaste,
  FileCode,
  Tag,
  Palette,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import { Note, EditorView, ClipItem, CategoryItem } from '../types';
import { exportToHtmlFile, copyRichHtml, formatHtml, getStats } from '../utils/htmlUtils';

interface NoteEditorProps {
  note: Note;
  onSave: (updatedNote: Note) => void;
  onBack: () => void;
  categories: CategoryItem[];
  clips: ClipItem[];
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onBack,
  categories,
  clips,
}) => {
  const [title, setTitle] = useState(note.title);
  const [htmlContent, setHtmlContent] = useState(note.htmlContent);
  const [category, setCategory] = useState(note.category);
  const [tagsInput, setTagsInput] = useState(note.tags.join(', '));
  const [viewMode, setViewMode] = useState<EditorView>('visual');
  const [copied, setCopied] = useState(false);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showClipsDrawer, setShowClipsDrawer] = useState(false);

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial content to visual editor
  useEffect(() => {
    if (visualEditorRef.current && viewMode === 'visual') {
      if (visualEditorRef.current.innerHTML !== htmlContent) {
        visualEditorRef.current.innerHTML = htmlContent;
      }
    }
  }, [viewMode]);

  // Handle visual input
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      setHtmlContent(visualEditorRef.current.innerHTML);
    }
  };

  // Execute formatting command in visual editor
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (viewMode !== 'visual') {
      setViewMode('visual');
      setTimeout(() => {
        document.execCommand(command, false, value);
        handleVisualInput();
      }, 50);
      return;
    }
    visualEditorRef.current?.focus();
    document.execCommand(command, false, value);
    handleVisualInput();
  };

  // Insert raw HTML in code mode or visual mode
  const insertHtmlSnippet = (snippet: string) => {
    if (viewMode === 'code') {
      const textarea = codeEditorRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = htmlContent.substring(0, start) + snippet + htmlContent.substring(end);
      setHtmlContent(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + snippet.length, start + snippet.length);
      }, 10);
    } else {
      executeCommand('insertHTML', snippet);
    }
  };

  // Image upload from phone / local
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        insertHtmlSnippet(`<img src="${base64}" alt="${file.name}" style="max-width:100%; border-radius:12px; margin: 12px 0;" />`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Insert Table
  const handleInsertTable = () => {
    const tableSnippet = `<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">العمود الأول</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">العمود الثاني</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">بيانات ١</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">بيانات ٢</td>
    </tr>
  </tbody>
</table>`;
    insertHtmlSnippet(tableSnippet);
  };

  // Handle Save
  const handleSave = () => {
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updated: Note = {
      ...note,
      title: title.trim() || 'ملاحظة بدون عنوان',
      htmlContent,
      category,
      tags: parsedTags,
      updatedAt: Date.now(),
    };

    onSave(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleCopy = async () => {
    const success = await copyRichHtml(htmlContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    exportToHtmlFile(title || 'ملاحظة', htmlContent);
  };

  const handlePrettifyCode = () => {
    const formatted = formatHtml(htmlContent);
    setHtmlContent(formatted);
  };

  const stats = getStats(htmlContent);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 py-2.5 flex items-center justify-between safe-top">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              handleSave();
              onBack();
            }}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="رجوع وحفظ"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
            {title ? (title.length > 18 ? title.slice(0, 18) + '...' : title) : 'ملاحظة جديدة'}
          </span>
          {isSavedNotice && (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full animate-pulse">
              تم الحفظ ✓
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="نسخ كود HTML"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="تحميل كملف HTML مستقل"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg font-medium text-xs shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ</span>
          </button>
        </div>
      </div>

      {/* Title & Metadata Inputs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان الملاحظة هنا..."
          className="w-full text-lg font-bold bg-transparent text-slate-900 dark:text-white border-0 outline-none placeholder-slate-400"
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Selector */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border-0 outline-none focus:ring-1 focus:ring-blue-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Tags Input */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg flex-1 min-w-[120px]">
            <Tag className="w-3 h-3 text-slate-400" />
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="وسوم (مفصولة بفاصلة)..."
              className="w-full text-xs bg-transparent border-0 outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400"
            />
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === 'visual'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>محرر مرئي</span>
            </button>

            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === 'code'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>كود HTML</span>
            </button>

            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-all ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة حية</span>
            </button>
          </div>

          {/* Quick Clipboard Drawer Button */}
          <button
            onClick={() => setShowClipsDrawer(!showClipsDrawer)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg active:scale-95 transition-all"
            title="إدراج من الحافظة"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>من الحافظة</span>
          </button>
        </div>
      </div>

      {/* Formatting Action Bar for Visual Mode */}
      {viewMode === 'visual' && (
        <div className="sticky top-[108px] z-10 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-2 py-1.5 overflow-x-auto flex items-center gap-1 scrollbar-none backdrop-blur-sm">
          <button
            onClick={() => executeCommand('formatBlock', '<h1>')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="عنوان رئيسي H1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', '<h2>')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="عنوان فرعي H2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', '<h3>')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="عنوان H3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            onClick={() => executeCommand('bold')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded font-bold"
            title="خط عريض Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('italic')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded italic"
            title="خط مائل Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('underline')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded underline"
            title="تسطير Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('strikeThrough')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded line-through"
            title="شطب Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="قائمة نقطية"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="قائمة رقمية"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="اقتباس Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Color Highlight */}
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded relative"
            title="ألوان وتظليل"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Link Insertion */}
          <button
            onClick={() => setShowLinkModal(true)}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="إدراج رابط <a>"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Image Insertion */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="إدراج صورة من الهاتف"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Table Insertion */}
          <button
            onClick={handleInsertTable}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="إدراج جدول <table>"
          >
            <TableIcon className="w-4 h-4" />
          </button>

          {/* Horizontal Line */}
          <button
            onClick={() => executeCommand('insertHorizontalRule')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            title="خط أفقي فاصل <hr>"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Code Mode Quick Tag Chips */}
      {viewMode === 'code' && (
        <div className="bg-slate-900 border-b border-slate-800 px-2 py-1.5 overflow-x-auto flex items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {[
              { tag: '<h1>العنوان</h1>', label: 'h1' },
              { tag: '<h2>العنوان</h2>', label: 'h2' },
              { tag: '<p>الفقرة</p>', label: 'p' },
              { tag: '<b>نص عريض</b>', label: 'b' },
              { tag: '<i>مائل</i>', label: 'i' },
              { tag: '<a href="https://">رابط</a>', label: 'a' },
              { tag: '<span style="color:#2563eb;">نص ملون</span>', label: 'span' },
              { tag: '<div style="padding:10px; border-radius:8px; background:#f1f5f9;">حاوية</div>', label: 'div' },
              { tag: '<hr />', label: 'hr' },
              { tag: '<code>رمز كود</code>', label: 'code' },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => insertHtmlSnippet(chip.tag)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-blue-400 font-mono text-[11px] rounded border border-slate-700 shrink-0"
              >
                &lt;{chip.label}&gt;
              </button>
            ))}
          </div>

          <button
            onClick={handlePrettifyCode}
            className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-sans text-[11px] shrink-0 border border-slate-700"
            title="تنسيق وترتيب كود HTML"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>تنسيق</span>
          </button>
        </div>
      )}

      {/* Quick Color Picker Dropdown */}
      {showColorPicker && viewMode === 'visual' && (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300 text-[11px]">
            لون الخط:
          </span>
          {['#000000', '#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea'].map((c) => (
            <button
              key={c}
              onClick={() => {
                executeCommand('foreColor', c);
                setShowColorPicker(false);
              }}
              style={{ backgroundColor: c }}
              className="w-5 h-5 rounded-full border border-slate-300 shadow-sm active:scale-95"
            />
          ))}
          <span className="font-semibold text-slate-600 dark:text-slate-300 text-[11px] mr-2">
            تظليل:
          </span>
          {['#fef08a', '#bbf7d0', '#fed7aa', '#bfdbfe', '#fbcfe8'].map((c) => (
            <button
              key={c}
              onClick={() => {
                executeCommand('hiliteColor', c);
                setShowColorPicker(false);
              }}
              style={{ backgroundColor: c }}
              className="w-5 h-5 rounded-md border border-slate-300 shadow-sm active:scale-95"
            />
          ))}
        </div>
      )}

      {/* Editor Body */}
      <div className="flex-1 p-3 overflow-y-auto">
        {viewMode === 'visual' && (
          <div
            ref={visualEditorRef}
            contentEditable
            onInput={handleVisualInput}
            className="min-h-[350px] p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 outline-none html-preview-content focus:ring-2 focus:ring-blue-500/20"
            dir="auto"
          />
        )}

        {viewMode === 'code' && (
          <div className="h-full flex flex-col">
            <textarea
              ref={codeEditorRef}
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="اكتب أو الصق كود HTML هنا..."
              className="w-full min-h-[380px] p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 outline-none leading-relaxed resize-none focus:ring-2 focus:ring-emerald-500/30"
              style={{ direction: 'ltr', textAlign: 'left' }}
              spellCheck={false}
            />
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                معاينة المتصفح المباشرة
              </span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                HTML5
              </span>
            </div>
            <div
              className="html-preview-content text-slate-900 dark:text-slate-100"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        )}
      </div>

      {/* Editor Footer Status Bar */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span>{stats.words} كلمة</span>
          <span>{stats.chars} حرف</span>
          <span>~{stats.readingTimeMin} دقيقة قراءة</span>
        </div>

        <div className="font-mono text-[10px] text-slate-400">
          صيغة HTML جاهزة للتصدير
        </div>
      </div>

      {/* Insert Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-800 animate-scaleUp">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              إدراج رابط جديد
            </h3>
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="عنوان أو نص الرابط"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg outline-none text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg outline-none text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500 font-mono"
                style={{ direction: 'ltr' }}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (linkUrl) {
                    const text = linkText.trim() || linkUrl;
                    insertHtmlSnippet(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`);
                    setShowLinkModal(false);
                    setLinkUrl('');
                    setLinkText('');
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إدراج الرابط
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clipboard Drawer for Instant Insertion */}
      {showClipsDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[70vh] flex flex-col p-4 shadow-2xl border-t border-slate-200 dark:border-slate-800 safe-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  إدراج قصاصة من الحافظة
                </h3>
              </div>
              <button
                onClick={() => setShowClipsDrawer(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
              >
                إغلاق
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-2 max-h-[50vh]">
              {clips.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-400">
                  الحافظة فارغة، أضف قصاصات من تبويب الحافظة.
                </p>
              ) : (
                clips.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => {
                      insertHtmlSnippet(clip.content);
                      setShowClipsDrawer(false);
                    }}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {clip.title || 'قصاصة بدون عنوان'}
                      </span>
                      <span className="text-[10px] font-mono uppercase bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        {clip.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-mono">
                      {clip.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
