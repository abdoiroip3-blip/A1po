/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Note,
  ClipItem,
  ActiveTab,
  ThemeMode,
} from './types';
import {
  DEFAULT_CATEGORIES,
  loadNotes,
  saveNotes,
  loadClips,
  saveClips,
  loadTheme,
  saveTheme,
  loadPhoneFrameSetting,
  savePhoneFrameSetting,
} from './utils/storage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { ClipboardManager } from './components/ClipboardManager';
import { TemplatesModal } from './components/TemplatesModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileFrame } from './components/MobileFrame';
import {
  FileText,
  Plus,
  Star,
  Pin,
  Trash2,
  Filter,
  CheckCircle,
  FilePlus,
  Layers,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [clips, setClips] = useState<ClipItem[]>(loadClips);
  const [activeTab, setActiveTab] = useState<ActiveTab>('notes');
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(loadTheme);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(loadPhoneFrameSetting);

  // Sync theme to root DOM
  useEffect(() => {
    saveTheme(theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('sepia');
    } else if (theme === 'sepia') {
      root.classList.remove('dark');
      root.classList.add('sepia');
    } else {
      root.classList.remove('dark');
      root.classList.remove('sepia');
    }
  }, [theme]);

  // Persist phone frame toggle
  useEffect(() => {
    savePhoneFrameSetting(isPhoneFrame);
  }, [isPhoneFrame]);

  // Save notes & clips on changes
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveClips(clips);
  }, [clips]);

  // Handle Note actions
  const handleCreateNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: '',
      htmlContent: '<h2>ملاحظة جديدة</h2>\n<p>اكتب أفكارك وملاحظاتك المنسقة هنا...</p>',
      category: selectedCategory === 'all' ? 'personal' : selectedCategory,
      tags: [],
      isPinned: false,
      isFavorite: false,
      inTrash: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentNote(newNote);
    setActiveTab('editor');
  };

  const handleCreateNoteFromClip = (content: string, clipTitle?: string) => {
    const isHtml = /<[a-z][\s\S]*>/i.test(content);
    const htmlContent = isHtml ? content : `<p>${content.replace(/\n/g, '<br />')}</p>`;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: clipTitle || 'ملاحظة من الحافظة',
      htmlContent,
      category: 'drafts',
      tags: ['من الحافظة'],
      isPinned: false,
      isFavorite: false,
      inTrash: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setCurrentNote(newNote);
    setActiveTab('editor');
  };

  const handleSelectTemplate = (tmplTitle: string, tmplContent: string, tmplCategory: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: tmplTitle,
      htmlContent: tmplContent,
      category: 'work',
      tags: ['قالب'],
      isPinned: false,
      isFavorite: false,
      inTrash: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setCurrentNote(newNote);
    setActiveTab('editor');
  };

  const handleImportHtmlFile = (fileName: string, htmlContent: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: fileName || 'ملف HTML مستورد',
      htmlContent,
      category: 'code',
      tags: ['مستورد', 'HTML'],
      isPinned: false,
      isFavorite: false,
      inTrash: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setCurrentNote(newNote);
    setActiveTab('editor');
  };

  const handleSaveCurrentNote = (savedNote: Note) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === savedNote.id);
      if (exists) {
        return prev.map((n) => (n.id === savedNote.id ? savedNote : n));
      }
      return [savedNote, ...prev];
    });
    setCurrentNote(savedNote);
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n))
    );
  };

  const handleToggleFavorite = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, inTrash: true, updatedAt: Date.now() } : n))
    );
  };

  const handleRestoreNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, inTrash: false, updatedAt: Date.now() } : n))
    );
  };

  const handlePermanentDeleteNote = (id: string) => {
    if (window.confirm('هل أنت متأكد من الحذف النهائي لهذه الملاحظة؟ لا يمكن التراجع.')) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('هل تريد إفراغ سلة المحذوفات بالكامل نهائياً؟')) {
      setNotes((prev) => prev.filter((n) => !n.inTrash));
    }
  };

  // Clipboard Clip Handlers
  const handleAddClip = (clipData: Omit<ClipItem, 'id' | 'createdAt'>) => {
    const newClip: ClipItem = {
      ...clipData,
      id: `clip-${Date.now()}`,
      createdAt: Date.now(),
    };
    setClips((prev) => [newClip, ...prev]);
  };

  const handleDeleteClip = (id: string) => {
    setClips((prev) => prev.filter((c) => c.id !== id));
  };

  const handleTogglePinClip = (id: string) => {
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const handleClearAllClips = () => {
    if (window.confirm('هل تريد مسح جميع قصاصات الحافظة؟')) {
      setClips([]);
    }
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Active notes (excluding trash)
  const activeNotes = notes.filter((n) => !n.inTrash);
  const trashNotes = notes.filter((n) => n.inTrash);

  // Filter notes
  const filteredNotes = activeNotes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.htmlContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesFavorite = !onlyFavorites || n.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  // Sort pinned first, then recently updated
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <MobileFrame isPhoneFrame={isPhoneFrame} onToggleFrame={() => setIsPhoneFrame(!isPhoneFrame)}>
      {/* Header */}
      {activeTab !== 'editor' && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isPhoneFrame={isPhoneFrame}
          setIsPhoneFrame={setIsPhoneFrame}
          trashCount={trashNotes.length}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* TAB 1: NOTES LIST */}
        {activeTab === 'notes' && (
          <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Category Filter Horizontal Scroll */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const count =
                    cat.id === 'all'
                      ? activeNotes.length
                      : activeNotes.filter((n) => n.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}

                {/* Favorite filter toggle */}
                <button
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    onlyFavorites
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="الملاحظات المفضلة"
                >
                  <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : ''}`} />
                  <span>المفضلة</span>
                </button>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="p-3">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    HTML Notes Mobile
                  </span>
                  <h2 className="text-base font-bold mt-1.5 mb-1">
                    كتابة وتنسيق وتصدير HTML
                  </h2>
                  <p className="text-xs text-blue-100 opacity-90 max-w-xs">
                    أنشئ ملاحظات منسقة بعناوين وجداول وأكواد، وحمّلها بصيغة HTML جاهزة.
                  </p>
                </div>
                <button
                  onClick={handleCreateNewNote}
                  className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-md shrink-0 active:scale-95 transition-transform"
                  title="إنشاء ملاحظة جديدة"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Notes Grid */}
            <div className="p-3 pt-0 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 mb-1">
                <span>{sortedNotes.length} ملاحظة</span>
                {onlyFavorites && (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    عرض المفضلة فقط
                  </span>
                )}
              </div>

              {sortedNotes.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">
                    لا توجد ملاحظات تطابق بحثك
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs mx-auto">
                    ابدأ بإنشاء ملاحظة HTML جديدة أو اختر قالباً جاهزاً من تبويب القوالب.
                  </p>
                  <button
                    onClick={handleCreateNewNote}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ملاحظة جديدة</span>
                  </button>
                </div>
              ) : (
                sortedNotes.map((note) => {
                  const cat = DEFAULT_CATEGORIES.find((c) => c.id === note.category);
                  return (
                    <NoteCard
                      key={note.id}
                      note={note}
                      categoryLabel={cat?.name}
                      onEdit={(n) => {
                        setCurrentNote(n);
                        setActiveTab('editor');
                      }}
                      onTogglePin={handleTogglePin}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDeleteNote}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SMART CLIPBOARD */}
        {activeTab === 'clipboard' && (
          <ClipboardManager
            clips={clips}
            onAddClip={handleAddClip}
            onDeleteClip={handleDeleteClip}
            onTogglePin={handleTogglePinClip}
            onClearAll={handleClearAllClips}
            onCreateNoteFromClip={handleCreateNoteFromClip}
          />
        )}

        {/* TAB 3: HTML EDITOR */}
        {activeTab === 'editor' && currentNote && (
          <NoteEditor
            note={currentNote}
            onSave={handleSaveCurrentNote}
            onBack={() => setActiveTab('notes')}
            categories={DEFAULT_CATEGORIES.filter((c) => c.id !== 'all')}
            clips={clips}
          />
        )}

        {/* TAB 4: TEMPLATES */}
        {activeTab === 'templates' && (
          <TemplatesModal
            onSelectTemplate={handleSelectTemplate}
            onClose={() => setActiveTab('notes')}
          />
        )}

        {/* TAB 5: TRASH (RECYCLE BIN) */}
        {activeTab === 'trash' && (
          <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-3 pb-20">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {trashNotes.length} ملاحظة في سلة المحذوفات
              </span>
              {trashNotes.length > 0 && (
                <button
                  onClick={handleEmptyTrash}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  إفراغ السلة بالكامل
                </button>
              )}
            </div>

            {trashNotes.length === 0 ? (
              <div className="text-center py-16">
                <Trash2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-500">سلة المحذوفات فارغة حالياً</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {trashNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => {}}
                    onTogglePin={() => {}}
                    onToggleFavorite={() => {}}
                    onDelete={() => {}}
                    isTrashView
                    onRestore={handleRestoreNote}
                    onPermanentDelete={handlePermanentDeleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsModal
            theme={theme}
            setTheme={setTheme}
            isPhoneFrame={isPhoneFrame}
            setIsPhoneFrame={setIsPhoneFrame}
            notesCount={activeNotes.length}
            clipsCount={clips.length}
            onImportHtmlFile={handleImportHtmlFile}
            onResetData={handleResetData}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {activeTab !== 'editor' && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewNote={handleCreateNewNote}
          notesCount={activeNotes.length}
          clipsCount={clips.length}
        />
      )}
    </MobileFrame>
  );
}
