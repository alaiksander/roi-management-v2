/**
 * Load data from localStorage, or return fallback if not found or invalid.
 */
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Save data to localStorage.
 */
export function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Handle quota exceeded or other errors silently for MVP
  }
}