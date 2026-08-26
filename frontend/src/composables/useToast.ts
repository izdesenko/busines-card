import { reactive } from 'vue';

export type ToastKind = 'success' | 'error';

export interface ToastItem {
  id: number;
  type: ToastKind;
  message: string;
}

// Единое реактивное хранилище тостов на всё приложение —
// достаточно простого модуля-синглтона, отдельный Pinia-стор тут избыточен.
const toasts = reactive<ToastItem[]>([]);
let counter = 0;

export function useToast() {
  function push(message: string, type: ToastKind = 'success', duration = 4000) {
    const id = ++counter;
    toasts.push({ id, type, message });
    setTimeout(() => remove(id), duration);
  }

  function remove(id: number) {
    const idx = toasts.findIndex((t) => t.id === id);
    if (idx !== -1) toasts.splice(idx, 1);
  }

  return { toasts, push, remove };
}
