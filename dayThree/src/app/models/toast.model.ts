export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  durationMs: number;
}