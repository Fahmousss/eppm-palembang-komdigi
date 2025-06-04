/**
 * A utility function to conditionally join class names together
 * Useful for combining Tailwind/NativeWind classes conditionally
 */
export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Memangkas teks jika melebihi batas karakter tertentu.
 * @param {string} text - Teks yang ingin dipotong.
 * @param {number} maxLength - Panjang maksimal karakter sebelum dipotong.
 * @returns {string} - Teks yang sudah dipangkas atau asli jika tidak melebihi batas.
 */
export function trimText(text: string, maxLength: number) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

