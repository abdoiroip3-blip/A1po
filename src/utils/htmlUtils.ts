import { ClipType } from '../types';

/**
 * Strips HTML tags to plain text
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * Calculates word and character count
 */
export function getStats(html: string): { words: number; chars: number; readingTimeMin: number } {
  const text = stripHtml(html).trim();
  if (!text) return { words: 0, chars: 0, readingTimeMin: 0 };
  const words = text.split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const readingTimeMin = Math.max(1, Math.ceil(words / 180));
  return { words, chars, readingTimeMin };
}

/**
 * Detects the content type of a snippet
 */
export function detectContentType(content: string): ClipType {
  const trimmed = content.trim();

  // Check if HTML
  if (/<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>/i.test(trimmed) || /<([a-z][a-z0-9]*)\b[^>]*\/>/i.test(trimmed) || /^<!DOCTYPE/i.test(trimmed)) {
    return 'html';
  }

  // Check URL
  if (/^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i.test(trimmed)) {
    return 'link';
  }

  // Check Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'email';
  }

  // Check Color (hex, rgb)
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(trimmed) || /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i.test(trimmed)) {
    return 'color';
  }

  // Check Code (contains brackets, semicolons, function definitions, script tags)
  if (/(function|const|let|var|class|def|import|return|=>|\{|\}|;\s*$)/m.test(trimmed) && trimmed.includes('\n')) {
    return 'code';
  }

  return 'text';
}

/**
 * Formats/indents HTML string
 */
export function formatHtml(html: string): string {
  let formatted = '';
  let indent = 0;
  const tab = '  ';

  // Basic regex tokenizer for tags
  const tokens = html.replace(/>\s*</g, '><').split(/(?=[<])/);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      formatted += tab.repeat(indent) + token + '\n';
    } else if (token.startsWith('<') && !token.startsWith('<!') && !token.includes('/>') && !token.startsWith('<img') && !token.startsWith('<input') && !token.startsWith('<hr') && !token.startsWith('<br')) {
      formatted += tab.repeat(indent) + token + '\n';
      // Only indent if it's not a self-closing or inline closed tag
      if (!token.endsWith('/>') && !token.includes('</')) {
        indent++;
      }
    } else {
      formatted += tab.repeat(indent) + token + '\n';
    }
  }

  return formatted.trim() || html;
}

/**
 * Generates and downloads a complete standalone styled HTML file
 */
export function exportToHtmlFile(title: string, htmlContent: string) {
  const safeTitle = (title.trim() || 'ملاحظة_بدون_عنوان').replace(/[/\\?%*:|"<>]/g, '-');
  
  const fullDocument = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title || 'ملاحظة HTML')}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Fira+Code&display=swap');
    
    :root {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #1e293b;
      --border: #e2e8f0;
      --primary: #2563eb;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0f172a;
        --card-bg: #1e293b;
        --text: #f1f5f9;
        --border: #334155;
        --primary: #3b82f6;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.7;
      padding: 1.5rem 1rem;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: var(--card-bg);
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border);
    }

    header {
      border-bottom: 2px solid var(--border);
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    h1.note-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .meta {
      font-size: 0.85rem;
      opacity: 0.7;
    }

    .content h1, .content h2, .content h3, .content h4 {
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 700;
      line-height: 1.3;
    }

    .content p {
      margin-bottom: 1rem;
    }

    .content ul, .content ol {
      margin-inline-start: 1.75rem;
      margin-bottom: 1rem;
    }

    .content li {
      margin-bottom: 0.35rem;
    }

    .content blockquote {
      border-inline-start: 4px solid var(--primary);
      padding-inline-start: 1rem;
      font-style: italic;
      margin: 1.25rem 0;
      opacity: 0.9;
      background: rgba(37, 99, 235, 0.05);
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      border-radius: 0 0.5rem 0.5rem 0;
    }

    .content code {
      font-family: 'Fira Code', monospace;
      background: rgba(100, 116, 139, 0.15);
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.9em;
      direction: ltr;
      display: inline-block;
    }

    .content pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 1rem;
      border-radius: 0.75rem;
      overflow-x: auto;
      margin: 1rem 0;
      direction: ltr;
      text-align: left;
    }

    .content pre code {
      background: none;
      padding: 0;
      color: inherit;
    }

    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    .content th, .content td {
      border: 1px solid var(--border);
      padding: 0.75rem;
      text-align: right;
    }

    .content th {
      background-color: rgba(100, 116, 139, 0.1);
      font-weight: 700;
    }

    .content img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }

    .content a {
      color: var(--primary);
      text-decoration: underline;
    }

    footer {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      text-align: center;
      font-size: 0.8rem;
      opacity: 0.6;
    }

    @media print {
      body {
        background: white;
        color: black;
        padding: 0;
      }
      .container {
        box-shadow: none;
        border: none;
        max-width: 100%;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1 class="note-title">${escapeHtml(title || 'ملاحظة')}</h1>
      <div class="meta">تم التصدير في: ${new Date().toLocaleDateString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}</div>
    </header>
    <div class="content">
      ${htmlContent}
    </div>
    <footer>
      تم إنشاؤه عبر تطبيق حافظة وملاحظات HTML للجوال
    </footer>
  </div>
</body>
</html>`;

  const blob = new Blob([fullDocument], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeTitle}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copies rich HTML and fallback plain text to clipboard
 */
export async function copyRichHtml(html: string): Promise<boolean> {
  const plainText = stripHtml(html);
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const htmlBlob = new Blob([html], { type: 'text/html' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': textBlob,
          'text/html': htmlBlob,
        }),
      ]);
      return true;
    }
  } catch (err) {
    console.warn('ClipboardItem write failed, trying fallback', err);
  }

  // Fallback to text copy
  try {
    await navigator.clipboard.writeText(html);
    return true;
  } catch (err) {
    console.error('Copy failed', err);
    return false;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
