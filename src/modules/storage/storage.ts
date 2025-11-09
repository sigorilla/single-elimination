// Простая утилита для работы с localStorage с безопасным JSON

export function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function safeStringify<T>(value: T): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

export function getStorage<T>(key: string, fallback: T): T {
  return safeParse<T>(localStorage.getItem(key), fallback);
}

export function setStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, safeStringify(value));
}
