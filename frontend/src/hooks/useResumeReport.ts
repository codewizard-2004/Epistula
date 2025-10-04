import api from "@/services/apiClient";
import { useMutation } from "@tanstack/react-query";

type JDKeyWords = {
  company_name?: string;
  address?: string;
  role?: string;
  seniority?: string;
  must_have: string[];
  nice_to_have?: string[];
  tools: string[];
};

type ResumeProfile = {
  name: string;
  contact?: string[];
  education?: string[];
  experience?: string[];
  skills?: string[];
  certifications?: string[];
  projects?: string[];
};

type ResumeReport = {
  matched_skills: string[];
  missed_skills: string[];
  phrasing_suggestions: string[];
  relevance_score: number;
};

export function useResumeReport({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: ResumeReport) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: async ({
      jd_keywords,
      resume_profile,
    }: {
      jd_keywords: JDKeyWords;
      resume_profile: ResumeProfile;
    }) => {
      const { data } = await api.post<ResumeReport>("/generate/resume-report", {
        jd_keywords,
        resume_profile,
      });
      return data;
    },
    onSuccess,
    onError,
  });
}
