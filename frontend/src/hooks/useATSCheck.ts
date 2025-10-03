// hooks/useUploadResume.ts
import api from "@/services/apiClient";
import { useMutation } from "@tanstack/react-query";

export function useATSCheck({ onSuccess, onError }: { onSuccess?: (data: any) => void, onError?: (err: any) => void }) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/upload/ats", formData,{
        headers: {"Content-Type": "multipart/form-data"},
      });
      return data;
    },
    onSuccess,
    onError,
  });
}
