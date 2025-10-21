import React from 'react'
import { Mail, FileText, Clock, Download, Trash2, X } from 'lucide-react'
import { Button } from './ui/button'

type HistoryModalProps = {
    selectedHistoryItem: any,
    handleDownloadHistory: (item: any) => void,
    handleDeleteHistory: (id: string) => void,
    setShowHistoryDialog: (show: boolean) => void,
    setSelectedHistoryItem: (item: any) => void,
}

const HistoryModal = ({
    selectedHistoryItem, 
    handleDownloadHistory, 
    handleDeleteHistory, 
    setShowHistoryDialog,
    setSelectedHistoryItem}: HistoryModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                {selectedHistoryItem.type === 'email' ? (
                  <Mail className="w-6 h-6 text-blue-400" />
                ) : (
                  <FileText className="w-6 h-6 text-purple-400" />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedHistoryItem.title}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {selectedHistoryItem.type === 'email' ? 'Email' : 'Cover Letter'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedHistoryItem.createdAt ? new Date(selectedHistoryItem.createdAt.toDate()).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-700 hover:bg-gray-800 text-black hover:text-white"
                  onClick={() => handleDownloadHistory(selectedHistoryItem)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-white"
                  onClick={() => handleDeleteHistory(selectedHistoryItem.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-black"
                  onClick={() => {
                    setShowHistoryDialog(false);
                    setSelectedHistoryItem(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Dialog Content - Side by Side Layout */}
            <div className="flex h-[calc(90vh-120px)] flex-wrap">
              {/* Job Description Section */}
              <div className="flex-1 border-r border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-400" />
                  Job Description
                </h3>
                <div className="bg-gray-800/50 rounded-lg p-4 h-[calc(100%-60px)] overflow-y-auto">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedHistoryItem.jobDescription}
                  </p>
                </div>
              </div>

              {/* Generated Output Section */}
              <div className="flex-1 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  {selectedHistoryItem.type === 'email' ? (
                    <Mail className="w-5 h-5 mr-2 text-purple-400" />
                  ) : (
                    <FileText className="w-5 h-5 mr-2 text-purple-400" />
                  )}
                  Generated {selectedHistoryItem.type === 'email' ? 'Email' : 'Cover Letter'}
                </h3>
                <div className="bg-gray-800/50 rounded-lg p-4 h-[calc(100%-60px)] overflow-y-auto">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedHistoryItem.output}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default HistoryModal
