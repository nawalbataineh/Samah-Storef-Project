/**
 * Image URL utilities for Samah Store
 */

// IMPORTANT: default to empty string so production doesn't accidentally point to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Convert relative or absolute image URLs to full URLs
 * @param {string} url - Image URL from backend
 * @returns {string} - Full image URL or placeholder
 */
export const getImageUrl = (url) => {
  if (!url) {
    return '/placeholder.jpg'; // Fallback placeholder
  }

  // If already absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If relative URL, prefix with base URL
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE_URL}${cleanUrl}`;
};

/**
 * Get image URL with fallback
 * @param {string} url - Image URL
 * @param {string} fallback - Fallback URL
 * @returns {string}
 */
export const getImageUrlWithFallback = (url, fallback = '/placeholder.jpg') => {
  if (!url) return fallback;
  return getImageUrl(url);
};
