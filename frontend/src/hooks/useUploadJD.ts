import api from "@/services/apiClient";
import { useMutation } from "@tanstack/react-query";
import { text } from "stream/consumers";

type useUploadJDProps = {
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}

type JDRequest = {
    job_desc: string;
}
export function useUploadJD({onSuccess, onError}: useUploadJDProps){
    return useMutation({
        mutationFn: async(job_desc: string) => {
            const { data } = await api.post<JDRequest>("/upload/jd", {
                job_desc
            });
            return data;
        },
        onSuccess: onSuccess,
        onError: onError
    })
}