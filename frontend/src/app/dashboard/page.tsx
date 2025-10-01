"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, Upload, Zap, CheckCircle, AlertCircle, Download, 
  Copy, Mail, FileOutput, Loader2, ChevronRight, BarChart3,
  TrendingUp, TrendingDown, Lightbulb, User, LogOut, Crown
} from 'lucide-react';

export default function Dashboard() {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'report' | 'generating' | 'result'>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [outputType, setOutputType] = useState<'email' | 'letter' | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Mock data for resume report
  const reportData = {
    atsScore: 85,
    matchPercentage: 78,
    matching: [
      'Project Management Experience',
      'Agile Methodologies',
      'Team Leadership',
      'Budget Management'
    ],
    missing: [
      'Scrum Master Certification',
      'Stakeholder Management',
      'Risk Assessment'
    ],
    suggestions: [
      'Add quantifiable achievements with metrics',
      'Include relevant certifications prominently',
      'Emphasize cross-functional collaboration experience',
      'Use action verbs to start bullet points'
    ]
  };

  const stages = [
    { name: 'Parsing Resume', status: analysisProgress > 0 ? 'complete' : 'pending' },
    { name: 'Analyzing Job Description', status: analysisProgress > 33 ? 'complete' : analysisProgress > 0 ? 'active' : 'pending' },
    { name: 'Matching Skills', status: analysisProgress > 66 ? 'complete' : analysisProgress > 33 ? 'active' : 'pending' },
    { name: 'Generating Report', status: analysisProgress === 100 ? 'complete' : analysisProgress > 66 ? 'active' : 'pending' }
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

  const handleAnalyze = () => {
    setStep('analyzing');
    setAnalysisProgress(0);
    
    // Simulate progressive analysis
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('report'), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleGenerateCoverLetter = (type: 'email' | 'letter') => {
    setOutputType(type);
    setStep('generating');
    setGenerationProgress(0);
    
    // Simulate progressive generation
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep('result'), 500);
          return 100;
        }
        return prev + 8;
      });
    }, 250);
  };

  const mockCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Project Manager position at TechCorp. With over 8 years of experience in project management and a proven track record of delivering complex projects on time and within budget, I am confident in my ability to contribute to your team's success.

In my current role at Innovation Labs, I have successfully led cross-functional teams of up to 15 members, implementing Agile methodologies that increased project delivery speed by 40%. My experience in budget management and team leadership aligns perfectly with the requirements outlined in your job description.

I am particularly drawn to TechCorp's commitment to innovation and would be excited to bring my expertise in project management to help drive your upcoming initiatives forward.

Thank you for considering my application. I look forward to the opportunity to discuss how my background and skills would be a great fit for your team.

Best regards,
[Your Name]`;

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
            <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Pro Plan</span>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Upload Stage */}
        {step === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Create Your Perfect Cover Letter</h2>
              <p className="text-gray-400 text-lg">Upload your resume and paste the job description to get started</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Resume Upload */}
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Upload className="w-5 h-5 mr-2 text-purple-400" />
                    Upload Resume
                  </CardTitle>
                  <CardDescription>PDF or DOCX format</CardDescription>
                </CardHeader>
                <CardContent>
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-gray-800/50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {resumeFile ? (
                        <>
                          <FileText className="w-12 h-12 mb-3 text-emerald-400" />
                          <p className="text-sm text-gray-300 font-medium">{resumeFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mb-3 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF or DOCX (MAX. 10MB)</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} />
                  </label>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Job Description
                  </CardTitle>
                  <CardDescription>Paste the complete job posting</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className="min-h-[180px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                    value={jobDescription}
                    onChange={(e: any) => setJobDescription(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleAnalyze}
                disabled={!resumeFile || !jobDescription}
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5 mr-2" />
                Analyze & Check ATS
              </Button>
            </div>
          </div>
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
                      <p className="text-4xl font-bold text-emerald-400">{reportData.atsScore}%</p>
                      <p className="text-sm text-gray-500 mt-1">Excellent</p>
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
                      <p className="text-4xl font-bold text-purple-400">{reportData.matchPercentage}%</p>
                      <p className="text-sm text-gray-500 mt-1">Strong Match</p>
                    </div>
                    <TrendingUp className="w-16 h-16 text-purple-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Matching Keywords */}
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                    Matching
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reportData.matching.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Missing Keywords */}
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <AlertCircle className="w-5 h-5 mr-2 text-amber-400" />
                    Missing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reportData.missing.map((item, index) => (
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
                    Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reportData.suggestions.slice(0, 3).map((item, index) => (
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
              <CardContent className="space-y-8 py-8">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-purple-400 font-semibold">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-out"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>

                {/* Stage Indicators */}
                <div className="space-y-4">
                  {generationStages.map((stage, index) => (
                    <StageIndicator key={index} stage={stage} index={index} />
                  ))}
                </div>
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
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => navigator.clipboard.writeText(mockCoverLetter)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 rounded-lg p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {mockCoverLetter}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setStep('upload');
                  setResumeFile(null);
                  setJobDescription('');
                  setOutputType(null);
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