export interface Note {
  id: string;
  title: string;
  htmlContent: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  inTrash: boolean;
  createdAt: number;
  updatedAt: number;
  color?: string;
}

export type ClipType = 'text' | 'html' | 'link' | 'code' | 'email' | 'color';

export interface ClipItem {
  id: string;
  content: string;
  type: ClipType;
  title?: string;
  isPinned: boolean;
  createdAt: number;
  tags?: string[];
}

export type ActiveTab = 'notes' | 'clipboard' | 'editor' | 'templates' | 'trash' | 'settings';

export type EditorView = 'visual' | 'code' | 'preview';

export type ThemeMode = 'light' | 'dark' | 'sepia';

export interface CategoryItem {
  id: string;
  name: string;
  nameEn: string;
  iconName: string;
  color: string;
}
