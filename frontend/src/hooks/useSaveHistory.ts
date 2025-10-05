"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import { toast } from "sonner";

interface HistoryItem {
  userId: string;
  type: 'email' | 'letter';
  jobDescription: string;
  output: string;
  title: string;
  rating: number;
  createdAt: any; // serverTimestamp
}

interface SaveHistoryOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useSaveHistory() {
  const [isLoading, setIsLoading] = useState(false);

  const saveHistory = async (
    data: Omit<HistoryItem, 'createdAt'>,
    options?: SaveHistoryOptions
  ) => {
    setIsLoading(true);
    
    try {
      // Generate title from job description (first sentence or first 50 characters)
      const generateTitle = (jobDescription: string): string => {
        // Remove extra whitespace and get first sentence
        const trimmed = jobDescription.trim();
        const firstSentence = trimmed.split(/[.!?]/)[0];
        
        // If first sentence is too long, truncate to 50 characters
        if (firstSentence.length > 50) {
          return firstSentence.substring(0, 47) + '...';
        }
        
        // If no sentence ending found, take first 50 characters
        if (firstSentence === trimmed) {
          return trimmed.length > 50 ? trimmed.substring(0, 47) + '...' : trimmed;
        }
        
        return firstSentence;
      };

      const historyData: HistoryItem = {
        ...data,
        title: generateTitle(data.jobDescription),
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "history"), historyData);
      
      toast.success('History saved successfully', {
        description: 'Your generated content has been saved to your history.',
        duration: 3000,
      });

      options?.onSuccess?.();
    } catch (error) {
      console.error('Failed to save history:', error);
      
      toast.error('Failed to save history', {
        description: 'There was an error saving your generated content. Please try again.',
        duration: 5000,
      });

      options?.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveHistory,
    isLoading
  };
}
