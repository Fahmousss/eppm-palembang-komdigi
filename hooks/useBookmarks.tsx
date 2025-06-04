'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStorageState } from '~/hooks/useStorageState';

const STORAGE_KEY = 'bookmarks';

export function useBookmarks() {
  // Use the existing useStorageState hook
  const [[isLoading, storedBookmarks], setStoredBookmarks] = useStorageState(STORAGE_KEY);

  // Local state to manage bookmarks
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Parse bookmarks from storage when loaded
  useEffect(() => {
    if (!isLoading && storedBookmarks) {
      try {
        setBookmarks(JSON.parse(storedBookmarks));
      } catch (error) {
        console.error('Failed to parse bookmarks:', error);
        setBookmarks([]);
      }
    }
  }, [isLoading, storedBookmarks]);

  // Save bookmarks to storage
  const saveBookmarks = useCallback(
    (updatedBookmarks: any[]) => {
      setBookmarks(updatedBookmarks);
      setStoredBookmarks(JSON.stringify(updatedBookmarks));
    },
    [setStoredBookmarks]
  );

  // Check if an item is bookmarked
  const isBookmarked = useCallback(
    (id: string) => {
      return bookmarks.some((bookmark) => bookmark.id === id);
    },
    [bookmarks]
  );

  // Add or remove a bookmark
  const toggleBookmark = useCallback(
    (item: any) => {
      if (isBookmarked(item.id)) {
        // Remove bookmark
        const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== item.id);
        saveBookmarks(updatedBookmarks);
      } else {
        // Add bookmark with timestamp
        const newBookmark = {
          ...item,
          bookmarkedAt: new Date().toISOString(),
        };
        const updatedBookmarks = [newBookmark, ...bookmarks];
        saveBookmarks(updatedBookmarks);
      }
    },
    [bookmarks, isBookmarked, saveBookmarks]
  );

  // Remove a bookmark
  const removeBookmark = useCallback(
    (id: string) => {
      const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
      saveBookmarks(updatedBookmarks);
    },
    [bookmarks, saveBookmarks]
  );

  // Clear all bookmarks
  const clearAllBookmarks = useCallback(() => {
    setStoredBookmarks(null); // This will delete the item in your storage implementation
    setBookmarks([]);
  }, [setStoredBookmarks]);

  return {
    bookmarks,
    isLoading,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAllBookmarks,
  };
}
