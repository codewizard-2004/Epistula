"use client"
import React from 'react'
import { 
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent } from './ui/card'
import { Button } from './ui/button'
import { 
    Upload,
    FileText,
    Zap
    } from 'lucide-react'
import { Textarea } from './ui/textarea'



interface UploadContentProps {
  resumeFile: File | null;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  handleAnalyze: () => void;
}

const UploadContent: React.FC<UploadContentProps> = ({resumeFile, handleFileUpload, jobDescription, setJobDescription, handleAnalyze}) => {
  return (
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
              <Card className="border-gray-800 bg-gray-900 lg:w-[600px]">
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
                    className="min-h-[180px] w-[99%] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
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
  )
}

export default UploadContent
