// shared/types.ts
export interface CanvasElement {
  id: string;
  type: 'text' | 'image';
  content?: string; // For text elements
  url?: string; // For image elements
  styles: {
    left: number;
    top: number;
    width?: number;
    height?: number;
    fontSize?: string;
    color?: string;
    alignment?: 'left' | 'center' | 'right' | 'justify';
  };
  file?: string; // If you decide to store the file as a Base64 string
}
