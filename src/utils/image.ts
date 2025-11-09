export function validateImageUrl(url: string): boolean {
  try {
    new URL(url);
    return /^https?:\/\//.test(url);
  } catch {
    return false;
  }
}
