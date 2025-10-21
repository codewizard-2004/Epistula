import React from 'react'
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';

type DeleteAccountModalProps = {
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ setShowDeleteModal }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="border-red-500/50 bg-gray-900 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
                Delete Account?
              </CardTitle>
              <CardDescription>This action cannot be undone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Are you absolutely sure you want to delete your account? All your data, including:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                <li>Generated cover letters and emails</li>
                <li>Resume analysis history</li>
                <li>Account settings and preferences</li>
                <li>Active subscription (if any)</li>
              </ul>
              <p className="text-red-400 font-semibold text-sm">
                This action will be permanent and cannot be reversed.
              </p>
              <div className="flex space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-700"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    // Handle account deletion
                    console.log('Account deleted');
                    setShowDeleteModal(false);
                  }}
                >
                  Yes, Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
  )
}

export default DeleteAccountModal
