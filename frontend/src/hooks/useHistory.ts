"use client";

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  userId: string;
  type: 'email' | 'letter';
  jobDescription: string;
  output: string;
  title: string;
  rating: number | null;
  createdAt: any;
}

interface UseHistoryOptions {
  userId?: string;
}

export function useHistory({ userId }: UseHistoryOptions = {}) {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create a query for the user's history items, ordered by creation date (newest first)
    const q = query(
      collection(db, "history"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: HistoryItem[] = [];
        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data()
          } as HistoryItem);
        });
        setHistoryItems(items);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching history:', err);
        setError('Failed to load history');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const deleteHistoryItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, "history", itemId));
      toast.success('History item deleted', {
        description: 'The item has been removed from your history.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to delete history item:', error);
      toast.error('Failed to delete item', {
        description: 'There was an error deleting the history item. Please try again.',
        duration: 5000,
      });
    }
  };

  return {
    historyItems,
    loading,
    error,
    deleteHistoryItem
  };
}
