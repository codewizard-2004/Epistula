"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, CheckCircle, AlertCircle, Download, 
  Copy, Mail, FileOutput, Loader2, ChevronRight, BarChart3,
  TrendingUp, Lightbulb, User, LogOut, Crown
} from 'lucide-react';
import UploadContent from '@/components/UploadContent';
import { useUploadJD } from '@/hooks/useUploadJD';
import { useResumeProfile } from '@/hooks/useResumeProfile';
import { useATSCheck } from '@/hooks/useATSCheck';
import { useResumeReport } from '@/hooks/useResumeReport';
import { useGenerateCoverLetter } from '@/hooks/useGenerateCoverLetter';
import { useGenerateEmail } from '@/hooks/useGenerateEmail';
import { useSaveHistory } from '@/hooks/useSaveHistory';
import LoadingAnimation from '@/components/LoadingAnimation';
import StarRating from '@/components/StarRating';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

export default function Dashboard() {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'report' | 'generating' | 'result'>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [outputType, setOutputType] = useState<'email' | 'letter' | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  // ATS things here
  const [atsReport, setAtsReport] = useState<any>(null);
  const [atsMessage, setAtsMessage] = useState<string>("");
  const [atsColor, setAtsColor] = useState<string>("");

  // Final Report about the resume
  const [ resumeReport, setResumeReport ] = useState<any>(null);
  const [ resumeReportMessage, setResumeReportMessage ] = useState<string>("");
  const [ resumeReportColor, setResumeReportColor ] = useState<string>("");
  const [finalReport, setFinalReport] = useState<any>({
    jd_keywords: {},
    resume_profile: {},
    resume_report: {},
    pages: 1,
    cover_letter: ""
  });

  // Rating state
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const { user, profile, loading } = useAuth();
  console.log(profile)

  const router = useRouter()
  const { saveHistory } = useSaveHistory();



  const stages = [
    { name: 'Extracting Resume Profile', status: analysisProgress > 0 ? 'complete' : 'pending' },
    { name: 'Analyzing Job Description', status: analysisProgress > 33 ? 'complete' : analysisProgress > 0 ? 'active' : 'pending' },
    { name: 'Checking ATS Friendliness', status: analysisProgress > 50? 'complete' : analysisProgress > 33 ? 'active' : 'pending' },
    { name: 'Checking for Job Match' , status: analysisProgress > 80? 'complete' : analysisProgress > 50 ? 'active': "pending"},
    { name: 'Generating Report', status: analysisProgress > 90? 'complete' : analysisProgress > 80 ? 'active' : 'pending' },
  ];

  const generationStages = [
    { name: 'Analyzing Resume Highlights', status: generationProgress > 0 ? 'complete' : 'pending' },
    { name: 'Matching Job Requirements', status: generationProgress > 25 ? 'complete' : generationProgress > 0 ? 'active' : 'pending' },
    { name: 'Crafting Personalized Content', status: generationProgress > 50 ? 'complete' : generationProgress > 25 ? 'active' : 'pending' },
    { name: 'Optimizing Tone & Style', status: generationProgress > 75 ? 'complete' : generationProgress > 50 ? 'active' : 'pending' },
    { name: 'Final Polish', status: generationProgress === 100 ? 'complete' : generationProgress > 75 ? 'active' : 'pending' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const atsMessageColor = (value: number | string) => {
    console.log("ENTERED", value)
  const num = Number(value); // convert to number just in case
  if (num >= 90){
    setAtsMessage("Excellent");
    setAtsColor("text-emerald-400");
  } else if (num >= 80){
    setAtsMessage("Great");
    setAtsColor("text-lime-400");
  } else if (num >= 70){
    setAtsMessage("Good");
    setAtsColor("text-yellow-400");
  } else if (num >= 60){
    setAtsMessage("Average");
    setAtsColor("text-amber-400");
  } else {
    setAtsMessage("Not Good");
    setAtsColor("text-red-400");
  }
};

  const resumeReportMessageColor = (value: number | string) => {
  const num = Number(value); 
  if (num >= 90){
    setResumeReportMessage("Strong Match");
    setResumeReportColor("text-emerald-400");
  } else if (num >= 80){
    setResumeReportMessage("Good Match");
    setResumeReportColor("text-lime-400");
  } else if (num >= 70){
    setResumeReportMessage("Average Match");
    setResumeReportColor("text-yellow-400");
  } else if (num >= 60){
    setResumeReportMessage("Weak Match");
    setResumeReportColor("text-amber-400");
  } else {
    setResumeReportMessage("No Match");
    setResumeReportColor("text-red-400");
  }
};

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    setHasRated(true);
    // Here you could also send the rating to your backend for analytics
    console.log(`User rated ${outputType} with ${rating} stars`);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully', {
        description: 'You have been logged out of your account.',
        duration: 3000,
      });
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out', {
        description: 'An error occurred while signing out. Please try again.',
        duration: 5000,
      });
    }
  };


  // -------------------- React Query Hooks --------------------
  const uploadResumeHook = useResumeProfile({
    onSuccess: () => setAnalysisProgress(33),
    onError: (err) => {
      console.error('Resume upload failed:', err);
      toast.error('Failed to analyze resume', {
        description: 'Please check your file and try again.',
        duration: 5000,
      });
      setStep('upload');
    }
  });

  const uploadJDHook = useUploadJD({
    onSuccess: () => setAnalysisProgress(50),
    onError: (err) => {
      console.error('Job description upload failed:', err);
      toast.error('Failed to analyze job description', {
        description: 'Please check your input and try again.',
        duration: 5000,
      });
      setStep('upload');
    }
  });

  const atsCheckHook = useATSCheck({
    onSuccess: () => setAnalysisProgress(80),
    onError: (err) => {
      console.error('ATS check failed:', err);
      toast.error('Failed to check ATS compatibility', {
        description: 'Please try again or contact support.',
        duration: 5000,
      });
      setStep('upload');
    }
  });

  const resumeReportHook = useResumeReport({
    onSuccess: () => setAnalysisProgress(90),
    onError: (err) => {
      console.error('Resume report generation failed:', err);
      toast.error('Failed to generate resume report', {
        description: 'Please try again or contact support.',
        duration: 5000,
      });
      setStep('upload');
    }
  })

  const generateCoverLetterHook = useGenerateCoverLetter({
    onSuccess: () => setStep('result'),
    onError: (err) => {
      console.error('Cover letter generation failed:', err);
      toast.error('Failed to generate cover letter', {
        description: 'Please try again or contact support.',
        duration: 5000,
      });
      setStep('report');
    }
  })

  const generateEmailHook = useGenerateEmail({
    onSuccess: () => setStep('result'),
    onError: (err) => {
      console.error('Email generation failed:', err);
      toast.error('Failed to generate email', {
        description: 'Please try again or contact support.',
        duration: 5000,
      });
      setStep('report');
    }
  })

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription) return;
    setStep('analyzing');
    setAnalysisProgress(0);

    try {
      // Step 1: Extract Resume Profile
      const resumeProfile = await uploadResumeHook.mutateAsync(resumeFile);
      setFinalReport((prev: any) => ({...prev, resume_profile: resumeProfile}));
      // Step 2: Analyze Job Description
      const jdKeywords =  await uploadJDHook.mutateAsync(jobDescription);
      setFinalReport((prev: any) => ({...prev, jd_keywords: jdKeywords}));
      // Step 3: ATS Check
      const atsreport = await atsCheckHook.mutateAsync(resumeFile);
      setAtsReport(atsreport);
      atsMessageColor(atsreport.score)
      // Step 4: Report ready
      const report = await resumeReportHook.mutateAsync({
        jd_keywords: jdKeywords,
        resume_profile: resumeProfile
      });
      setFinalReport((prev: any) => ({...prev, resume_report: report}));
      setResumeReport(report);
      resumeReportMessageColor(report.relevance_score)
      setAnalysisProgress(100);
      setStep('report');
      
      toast.success('Analysis completed!', {
        description: 'Your resume has been analyzed successfully.',
        duration: 3000,
      });
    } catch (err) {
      console.error("Analysis failed:", err);
      toast.error('Analysis failed', {
        description: 'An unexpected error occurred during analysis. Please try again.',
        duration: 5000,
      });
      setStep('upload');
    }
  };

  const handleGenerateCoverLetter = async (type: 'email' | 'letter') => {
    setOutputType(type);
    setStep('generating');
    setGenerationProgress(0);
    // Reset rating state for new generation
    setUserRating(0);
    setHasRated(false);
    
    // Get current data from state
    const currentData = {
      jd_keywords: finalReport.jd_keywords,
      resume_profile: finalReport.resume_profile,
      resume_report: finalReport.resume_report
    };

    try {
      let output = ""
      if (type == 'letter'){
        output = await generateCoverLetterHook.mutateAsync({ 
          jd_keywords: currentData.jd_keywords, 
          resume_profile: currentData.resume_profile, 
          resume_report: currentData.resume_report, 
          pages: 1 
      });
    }else{
        output = await generateEmailHook.mutateAsync({
          jd_keywords: currentData.jd_keywords,
          resume_profile: currentData.resume_profile,
          resume_report: currentData.resume_report
        })
    }
      setFinalReport((prev: any) => ({...prev, cover_letter: output}))
      setGenerationProgress(100)
      setStep('result')
      
      // Save to history if user is authenticated
      if (user?.uid) {
        if (hasRated){
        await saveHistory({
          userId: user.uid,
          type: type,
          jobDescription: jobDescription,
          output: output,
          title: '',
          rating: userRating
        });
      }else{
        await saveHistory({
          userId: user.uid,
          type: type,
          jobDescription: jobDescription,
          output: output,
          title: '',
          rating: userRating
        });
      }
      }
      
      toast.success(`${type === 'email' ? 'Email' : 'Cover letter'} generated!`, {
        description: `Your ${type === 'email' ? 'email' : 'cover letter'} is ready for review.`,
        duration: 3000,
      });
    } catch (err) {
      console.error("Cover letter generation failed:", err)
      toast.error('Generation failed', {
        description: 'An unexpected error occurred during generation. Please try again.',
        duration: 5000,
      });
      setGenerationProgress(100)
      setStep('report')
    }
  };
  

  const StageIndicator = ({ stage, index }: any) => (
    <div className="flex items-center space-x-3">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
        stage.status === 'complete' ? 'bg-emerald-600 border-emerald-600' :
        stage.status === 'active' ? 'bg-purple-600 border-purple-600 animate-pulse' :
        'bg-gray-800 border-gray-700'
      }`}>
        {stage.status === 'complete' ? (
          <CheckCircle className="w-5 h-5 text-white" />
        ) : stage.status === 'active' ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : (
          <span className="text-gray-500 text-sm">{index + 1}</span>
        )}
      </div>
      <span className={`text-sm font-medium ${
        stage.status === 'complete' || stage.status === 'active' ? 'text-white' : 'text-gray-500'
      }`}>
        {stage.name}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Epistula</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-white hover:text-black">
              {loading? <Spinner/>:profile?.plan == "free" ? 
                <div onClick={()=>router.push("/pricing")} className="text-sm font-medium">Upgrade to pro</div>:
              (
                <>
              <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Pro Plan</span>
                </>
                )
              }
            </div>
            <Button 
              variant="link" 
              size="icon" 
              onClick={()=>router.push("/dashboard/profile")}
              className="text-gray-300 hover:text-black transform transition duration-300 ease-in-out hover:scale-110">
            {loading?
            <Spinner />:
            user?.photoURL ?
              <Image 
                src={user.photoURL}
                alt={user.displayName ?? "User"}
                width={50}
                height={50}
                className="rounded-full border border-gray-700"
              />:
              <User className="w-5 h-5" />
            }
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-black">
                  <LogOut className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Sign Out Warning</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300">
                    Are you sure you want to sign out? You will lose access to your dashboard and any unsaved progress will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Upload Stage */}
        {step === 'upload' && (
          <UploadContent
            resumeFile={resumeFile}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            handleFileUpload={handleFileUpload}
            handleAnalyze={handleAnalyze}
           />
        )}

        {/* Analyzing Stage */}
        {step === 'analyzing' && (
          <div className="max-w-3xl mx-auto">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white mb-2">Analyzing Your Resume</CardTitle>
                <CardDescription>This will take just a moment...</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 py-8">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-purple-400 font-semibold">{analysisProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                </div>

                {/* Stage Indicators */}
                <div className="space-y-4">
                  {stages.map((stage, index) => (
                    <StageIndicator key={index} stage={stage} index={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Report Stage */}
        {step === 'report' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2">Resume Analysis Report</h2>
              <p className="text-gray-400">Here's how your resume matches the job description</p>
            </div>

            {/* Score Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-emerald-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 mb-1">ATS Friendliness</p>
                      <p className={`text-4xl font-bold ${atsColor}`}>{atsReport?.score || 0}%</p>
                      <p className="text-sm text-gray-500 mt-1">{atsMessage}</p>
                    </div>
                    <BarChart3 className="w-16 h-16 text-emerald-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-purple-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 mb-1">Job Match</p>
                      <p className={`text-4xl font-bold ${resumeReportColor}`}>{resumeReport?.relevance_score}%</p>
                      <p className="text-sm text-gray-500 mt-1">{resumeReportMessage}</p>
                    </div>
                    <TrendingUp className="w-16 h-16 text-purple-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <div className="flex flex-wrap md:grid-cols-3 gap-6 ">
              {/* Suggestions */}
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Lightbulb className="w-5 h-5 mr-2 text-blue-400" />
                    Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {atsReport?.suggestions?.map((item: any, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              {/* Matching Keywords */}
              <Card className="border-gray-800 bg-gray-900 w-[48%]">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                    Matching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resumeReport.matched_skills.length == 0? <h1 className='text-red-300'>No matching Skills found</h1>:
                    resumeReport?.matched_skills?.map((item: any, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Missing Keywords */}
              <Card className="border-gray-800 bg-gray-900 w-[49%]">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <AlertCircle className="w-5 h-5 mr-2 text-amber-400" />
                    Missing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resumeReport?.missed_skills?.map((item: any, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Lightbulb className="w-5 h-5 mr-2 text-blue-400" />
                    Phrasing Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resumeReport?.phrasing_suggestions?.map((item: any, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              
            </div>

            {/* Generate Cover Letter Section */}
            <Card className="border-purple-500/50 bg-gradient-to-br from-gray-900 to-purple-900/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Ready to Generate Your Cover Letter?</CardTitle>
                <CardDescription>Choose your preferred format</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center space-x-4">
                <Button
                  onClick={() => handleGenerateCoverLetter('letter')}
                  className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <FileOutput className="w-5 h-5 mr-2" />
                  Generate Letter
                </Button>
                <Button
                  onClick={() => handleGenerateCoverLetter('email')}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Generate Email
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generating Stage */}
        {step === 'generating' && (
          <div className="max-w-3xl mx-auto">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white mb-2">
                  Crafting Your {outputType === 'email' ? 'Email' : 'Cover Letter'}
                </CardTitle>
                <CardDescription>AI is personalizing content just for you...</CardDescription>
              </CardHeader>
              <CardContent className="w-full flex justify-center items-center">
                {/* Progress Bar */}
                <LoadingAnimation height={220} width={130}/>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Result Stage */}
        {step === 'result' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-2">Your {outputType === 'email' ? 'Email' : 'Cover Letter'} is Ready!</h2>
              <p className="text-gray-400">Review, copy, or download your personalized content</p>
            </div>

            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Generated Content</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-500 hover:bg-gray-800 hover:text-white"
                      onClick={() => navigator.clipboard.writeText(finalReport.cover_letter)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-500 hover:bg-gray-800 hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 rounded-lg p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {finalReport.cover_letter}
                </div>
              </CardContent>
            </Card>

            {/* Rating Section */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  {hasRated ? 'Thank you for your feedback!' : 'How would you rate this content?'}
                </CardTitle>
                <CardDescription className="text-center">
                  {hasRated 
                    ? `You rated this ${outputType} ${userRating} star${userRating !== 1 ? 's' : ''}`
                    : 'Your feedback helps us improve our AI-generated content'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <StarRating
                  onRatingChange={handleRatingChange}
                  initialRating={userRating}
                  disabled={hasRated}
                  size="lg"
                />
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setStep('upload');
                  setResumeFile(null);
                  setJobDescription('');
                  setOutputType(null);
                  setUserRating(0);
                  setHasRated(false);
                }}
                className="h-12 px-8 bg-purple-600 hover:bg-purple-700"
              >
                Create Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}