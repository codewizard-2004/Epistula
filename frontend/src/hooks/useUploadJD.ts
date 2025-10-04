import api from "@/services/apiClient";
import { useMutation } from "@tanstack/react-query";

type useUploadJDProps = {
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}

type JDKeyWords = {
    company_name?: string;
    address?: string;
    role?: string;
    seniority?: string;
    must_have: string[];
    nice_to_have?: string[];
    tools: string[];
  };


export function useUploadJD({onSuccess, onError}: useUploadJDProps){
    return useMutation({
        mutationFn: async(job_desc: string) => {
            const { data } = await api.post<JDKeyWords>("/upload/jd", {
                job_desc
            });
            return data;
        },
        onSuccess: onSuccess,
        onError: onError
    })
}