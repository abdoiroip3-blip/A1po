import { Note, ClipItem, CategoryItem, ThemeMode } from '../types';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'الكل', nameEn: 'All', iconName: 'Layers', color: 'blue' },
  { id: 'work', name: 'العمل', nameEn: 'Work', iconName: 'Briefcase', color: 'indigo' },
  { id: 'personal', name: 'شخصي', nameEn: 'Personal', iconName: 'User', color: 'emerald' },
  { id: 'code', name: 'أكواد HTML', nameEn: 'HTML & Code', iconName: 'Code', color: 'amber' },
  { id: 'ideas', name: 'أفكار ومشاريع', nameEn: 'Ideas', iconName: 'Sparkles', color: 'purple' },
  { id: 'drafts', name: 'مسودات سريعة', nameEn: 'Drafts', iconName: 'FileText', color: 'rose' },
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'مرحباً بك في تطبيق حافظة وملاحظات HTML للجوال 👋',
    htmlContent: `<h2>أهلاً بك في بيئة كتابة الملاحظات المتطورة</h2>
<p>هذا التطبيق صُمم خصيصاً ليمنحك تجربة الهاتف الأسرع والأكثر فاعلية في <strong>إدارة الحافظة وكتابة الملاحظات بصيغة HTML</strong> المتوافقة مع أي متصفح!</p>

<blockquote>
  💡 <strong>نصيحة سريعة:</strong> يمكنك التبديل بين المحرر المرئي، ومحرر كود HTML المباشر، والمعاينة الحية بضغطة زر واحدة.
</blockquote>

<h3>المميزات الرئيسية:</h3>
<ul>
  <li>📝 <strong>محرر HTML متكامل:</strong> عناوين، خط عريض، مائل، تظليل، قوائم، جداول وروابط.</li>
  <li>📋 <strong>حافظة نصوص ذكية:</strong> حفظ القصاصات وتصنيفها ونسخها بلمسة واحدة.</li>
  <li>🌐 <strong>تصدير بصيغة HTML كاملة:</strong> حمّل ملاحظتك كملف HTML جاهز للعرض والمشاركة.</li>
  <li>🎨 <strong>إدراج الصور والوسائط:</strong> إرفاق الصور من هاتفك مباشرةً.</li>
  <li>📱 <strong>واجهة هاتف ذكية:</strong> مصممة لشاشات اللمس والعمل دون إنترنت.</li>
</ul>

<hr />
<p style="color: #2563eb; font-weight: bold;">جرب كتابة ملاحظتك الأولى الآن!</p>`,
    category: 'personal',
    tags: ['دليل', 'ترحيب', 'HTML'],
    isPinned: true,
    isFavorite: true,
    inTrash: false,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 2,
    color: '#eff6ff',
  },
  {
    id: 'note-2',
    title: 'قالب كود HTML: بطاقة معلومات شخصية 📇',
    htmlContent: `<div style="padding: 1.25rem; border-radius: 1rem; background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; text-align: center;">
  <h2 style="margin: 0; font-size: 1.5rem; color: #ffffff;">عبد الرحمن أحمد</h2>
  <p style="opacity: 0.9; margin: 0.25rem 0;">مطور واجهات ومصمم تجربة مستخدم</p>
  <div style="margin: 1rem 0; display: inline-block; padding: 0.4rem 1rem; background: rgba(255,255,255,0.2); border-radius: 9999px; font-size: 0.85rem;">
    📍 الرياض، المملكة العربية السعودية
  </div>
  <p style="font-size: 0.85rem; margin-top: 0.5rem;">📧 contact@example.com | 📱 +966 50 000 0000</p>
</div>
<br>
<p>يمكنك نسخ ولصق هذا الكود واستخدامه في توقيع البريد أو صفحات المواقع.</p>`,
    category: 'code',
    tags: ['كود', 'بطاقة', 'تصميم'],
    isPinned: false,
    isFavorite: true,
    inTrash: false,
    createdAt: Date.now() - 3600000 * 48,
    updatedAt: Date.now() - 3600000 * 5,
    color: '#f5f3ff',
  },
  {
    id: 'note-3',
    title: 'قائمة مهام الأسبوع القادم 🗓️',
    htmlContent: `<h3>المهام الضرورية</h3>
<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">المهمة</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">الأولوية</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">الحالة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">تسليم مسودة المشروع النهائي</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #dc2626; font-weight: bold;">عالية</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">⏳ قيد التنفيذ</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">مراجعة كود صفحات HTML</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #d97706; font-weight: bold;">متوسطة</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">✅ مكتمل</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">تنظيم قصاصات الحافظة</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #16a34a;">عادية</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">⏳ قريباً</td>
    </tr>
  </tbody>
</table>`,
    category: 'work',
    tags: ['مهام', 'تخطيط', 'جدول'],
    isPinned: false,
    isFavorite: false,
    inTrash: false,
    createdAt: Date.now() - 3600000 * 72,
    updatedAt: Date.now() - 3600000 * 12,
    color: '#ecfdf5',
  },
];

const INITIAL_CLIPS: ClipItem[] = [
  {
    id: 'clip-1',
    content: '<a href="https://example.com" class="btn" style="background:#2563eb;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;">زر مخصص HTML</a>',
    type: 'html',
    title: 'زر HTML مخصص أنيق',
    isPinned: true,
    createdAt: Date.now() - 1000 * 60 * 30,
    tags: ['HTML', 'زر'],
  },
  {
    id: 'clip-2',
    content: 'abdoiroip3@gmail.com',
    type: 'email',
    title: 'البريد الإلكتروني الأساسي',
    isPinned: true,
    createdAt: Date.now() - 1000 * 60 * 60,
    tags: ['حساب', 'تواصل'],
  },
  {
    id: 'clip-3',
    content: 'https://developer.mozilla.org/ar/docs/Web/HTML',
    type: 'link',
    title: 'مرجع توثيق HTML من MDN بالعربية',
    isPinned: false,
    createdAt: Date.now() - 1000 * 60 * 120,
    tags: ['روابط', 'تعلم'],
  },
  {
    id: 'clip-4',
    content: '#3b82f6',
    type: 'color',
    title: 'كود اللون الأزرق الرئيسي Primary Blue',
    isPinned: false,
    createdAt: Date.now() - 1000 * 60 * 180,
    tags: ['ألوان', 'تصميم'],
  },
  {
    id: 'clip-5',
    content: `console.log("تطبيق الحافظة يعمل بنجاح!");`,
    type: 'code',
    title: 'سطر طباعة كود جافاسكريبت',
    isPinned: false,
    createdAt: Date.now() - 1000 * 60 * 240,
    tags: ['كود', 'JS'],
  },
];

export const HTML_TEMPLATES = [
  {
    id: 'template-blank',
    title: 'صفحة فارغة مجهزة',
    description: 'بداية نظيفة مع هيكل HTML أساسي',
    category: 'عام',
    content: `<h2>عنوان الملاحظة الجديد</h2>
<p>ابدأ بكتابة أفكارك وملاحظاتك المنسقة هنا...</p>`,
  },
  {
    id: 'template-article',
    title: 'مقال أو تقرير منسق',
    description: 'هيكل جاهز للمقالات بعناوين رئيسية وفرعية واقتباس',
    category: 'عمل',
    content: `<h1>عنوان المقال أو التقرير</h1>
<p class="lead"><strong>المقدمة:</strong> ملخص موجز لأهم النقاط التي يتناولها هذا التقرير.</p>
<hr />
<h2>١. المحور الأول</h2>
<p>تفاصيل وشرح المحور الأول مع إمكانية إضافة نقاط مرقمة.</p>
<blockquote>
  "النجاح هو مجموع مجهودات صغيرة تتكرر يوماً بعد يوم."
</blockquote>
<h2>٢. النتائج والتوصيات</h2>
<ul>
  <li>التوصية الأولى الهامة</li>
  <li>التوصية الثانية للتنفيذ الفوري</li>
</ul>`,
  },
  {
    id: 'template-todo',
    title: 'قائمة مهام تفاعلية',
    description: 'قائمة للمتابعة والتأشير على الإنجازات',
    category: 'شخصي',
    content: `<h3>قائمة إنجازات اليوم ✅</h3>
<div style="background: #f8fafc; padding: 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
  <p>☑️ مراجعة الرسائل الصباحية</p>
  <p>☑️ كتابة ملاحظات الاجتماع</p>
  <p>⬜ إرسال ملف الـ HTML النهائي للعميل</p>
  <p>⬜ ترتيب قصاصات الحافظة المهمة</p>
</div>`,
  },
  {
    id: 'template-table',
    title: 'جدول مقارنة وموازنة',
    description: 'جدول HTML متجاوب للمقارنة السريعة',
    category: 'عمل',
    content: `<h3>جدول المقارنة</h3>
<table style="width: 100%; border-collapse: collapse; text-align: right;">
  <thead>
    <tr style="background: #2563eb; color: white;">
      <th style="padding: 10px; border: 1px solid #cbd5e1;">المعيار</th>
      <th style="padding: 10px; border: 1px solid #cbd5e1;">الخيار أ</th>
      <th style="padding: 10px; border: 1px solid #cbd5e1;">الخيار ب</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">السرعة</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">فوري</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">متوسط</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">التكلفة</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">مجاني</td>
      <td style="padding: 10px; border: 1px solid #cbd5e1;">مدفوع</td>
    </tr>
  </tbody>
</table>`,
  },
  {
    id: 'template-snippet',
    title: 'توثيق مقتطف كود برمجي',
    description: 'شفرة برمجية مع شرح وظيفتها',
    category: 'أكواد HTML',
    content: `<h3>شرح دالة معالجة النصوص</h3>
<p>تقوم هذه الدالة بإزالة الفراغات الزائدة وتجهيز النص:</p>
<pre><code>function cleanText(input) {
  return input.trim().replace(/\\s+/g, ' ');
}
// مثال للاستخدام:
const result = cleanText("  مرحباً   بالعالم  ");
console.log(result);</code></pre>
<p><strong>ملاحظة:</strong> الدالة تعمل على جميع المتصفحات الحديثة.</p>`,
  },
];

const NOTES_KEY = 'html_mobile_notes_data';
const CLIPS_KEY = 'html_mobile_clips_data';
const THEME_KEY = 'html_mobile_theme_data';
const FRAME_KEY = 'html_mobile_frame_preview';

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) {
      saveNotes(INITIAL_NOTES);
      return INITIAL_NOTES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading notes from localStorage:', e);
    return INITIAL_NOTES;
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Error saving notes to localStorage:', e);
  }
}

export function loadClips(): ClipItem[] {
  try {
    const raw = localStorage.getItem(CLIPS_KEY);
    if (!raw) {
      saveClips(INITIAL_CLIPS);
      return INITIAL_CLIPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading clips from localStorage:', e);
    return INITIAL_CLIPS;
  }
}

export function saveClips(clips: ClipItem[]): void {
  try {
    localStorage.setItem(CLIPS_KEY, JSON.stringify(clips));
  } catch (e) {
    console.error('Error saving clips to localStorage:', e);
  }
}

export function loadTheme(): ThemeMode {
  try {
    return (localStorage.getItem(THEME_KEY) as ThemeMode) || 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Error saving theme:', e);
  }
}

export function loadPhoneFrameSetting(): boolean {
  try {
    const val = localStorage.getItem(FRAME_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function savePhoneFrameSetting(enabled: boolean): void {
  try {
    localStorage.setItem(FRAME_KEY, String(enabled));
  } catch (e) {
    console.error('Error saving phone frame setting:', e);
  }
}

export function exportAllDataBackup(): void {
  const data = {
    notes: loadNotes(),
    clips: loadClips(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `html_notes_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importDataBackup(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed.notes)) {
      saveNotes(parsed.notes);
    }
    if (Array.isArray(parsed.clips)) {
      saveClips(parsed.clips);
    }
    return true;
  } catch (e) {
    console.error('Failed to import backup:', e);
    return false;
  }
}
