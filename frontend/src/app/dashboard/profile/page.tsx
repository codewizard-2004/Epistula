"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, User, CreditCard, History, Trash2, Settings, 
  Crown, Calendar, Download, ArrowLeft, AlertTriangle, 
  CheckCircle, Clock, Mail, Bell, X, Eye,
  Delete,
  Trash
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useHistory } from '@/hooks/useHistory';
import Image from 'next/image';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import HistoryModal from '@/components/HistoryModal';
import DeleteAccountModal from '@/components/DeleteAccountModal';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscription' | 'history' | 'settings'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);

  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 15, 2025',
    plan: 'Pro',
    creditsUsed: 42,
    creditsTotal: 'Unlimited',
    nextBilling: 'February 1, 2025',
    billingAmount: '$19/month'
  };


  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const { user, profile, loading } = useAuth();
  const { historyItems, loading: historyLoading, deleteHistoryItem } = useHistory({ userId: user?.uid });
  if(!loading) console.log(profile, user)

  const handleViewHistory = (item: any) => {
    setSelectedHistoryItem(item);
    setShowHistoryDialog(true);
  };

  const handleDownloadHistory = (item: any) => {
    const element = document.createElement('a');
    const file = new Blob([item.output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${item.jobTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${item.type.toLowerCase().replace(' ', '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteHistory = async (itemId: string) => {
    try {
      await deleteHistoryItem(itemId);
      setShowHistoryDialog(false);
      setSelectedHistoryItem(null);
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-300 hover:text-black"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Epistula</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">Account Settings</h2>
            <p className="text-gray-400">Manage your profile, subscription, and preferences</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="border-gray-800 bg-gray-900 sticky top-24">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  {/* Profile Info */}
                  <Card className="border-gray-800 bg-gray-900">
                    <CardHeader>
                      <CardTitle className="text-white">Profile Information</CardTitle>
                      <CardDescription>Your personal account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-6">
                        { loading ?
                          <Spinner/>: 
                        user?.photoURL ?
                        <Image 
                          src={user.photoURL}
                          alt={user.displayName ?? "User"}
                          width={80}
                          height={80}
                          className="rounded-full border border-gray-700"
                        />:
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold">
                          {profile?.name.slice(0,3)}
                        </div>
                        }
                        <div>
                          {loading? <Spinner color='white'/>:
                          <>
                          <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                          <p className="text-gray-400">{user?.email}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Member since {profile.createdAt ? new Date(profile.createdAt.toDate()).toLocaleDateString() : ''}
                          </p>
                          </>
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Usage Stats */}
                  <Card className="border-gray-800 bg-gray-900">
                    <CardHeader>
                      <CardTitle className="text-white">Usage Overview</CardTitle>
                      <CardDescription>Your activity this billing period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Credits Left</span>
                            <FileText className="w-5 h-5 text-purple-400" />
                          </div>
                          <p className="text-3xl font-bold text-white">{profile?.usageLeft}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Current Plan</span>
                            <Crown className="w-5 h-5 text-yellow-400" />
                          </div>
                          <p className="text-3xl font-bold text-white">{profile?.plan}</p>
                          <p className="text-xs text-gray-500 mt-1">{profile?.pricing}$ per {profile?.term}</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-sm">Next Billing</span>
                            <Calendar className="w-5 h-5 text-blue-400" />
                          </div>
                          <p className="text-xl font-bold text-white">Feb 1</p>
                          <p className="text-xs text-gray-500 mt-1">2025</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <>
                  <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-purple-900/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center">
                            <Crown className="w-6 h-6 text-yellow-400 mr-2" />
                            Pro Plan
                          </CardTitle>
                          <CardDescription>Your current subscription</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-white">$19</p>
                          <p className="text-sm text-gray-400">per month</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Billing Cycle</span>
                          <span className="text-white font-medium">Monthly</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Next Billing Date</span>
                          <span className="text-white font-medium">{userData.nextBilling}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Payment Method</span>
                          <span className="text-white font-medium">•••• 4242</span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Update Payment Method
                        </Button>
                        <Button variant="outline" className="flex-1 border-gray-700 text-gray-900 hover:bg-gray-800 hover:text-white">
                          Change Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-gray-900">
                    <CardHeader>
                      <CardTitle className="text-white">Billing History</CardTitle>
                      <CardDescription>Your recent invoices</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { date: 'Jan 1, 2025', amount: '$19.00', status: 'Paid' },
                          { date: 'Dec 1, 2024', amount: '$19.00', status: 'Paid' },
                          { date: 'Nov 1, 2024', amount: '$19.00', status: 'Paid' }
                        ].map((invoice, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                            <div className="flex items-center space-x-4">
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                              <div>
                                <p className="text-white font-medium">{invoice.date}</p>
                                <p className="text-sm text-gray-500">Pro Plan - Monthly</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-white font-semibold">{invoice.amount}</span>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-black">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-500/50 bg-gray-900">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">Cancel Subscription</h4>
                          <p className="text-gray-400 text-sm mb-4">
                            You'll continue to have access until the end of your billing period. You can reactivate anytime.
                          </p>
                          <Button 
                            variant="outline" 
                            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-white"
                          >
                            Cancel Subscription
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <Card className="border-gray-800 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-white">Generation History</CardTitle>
                    <CardDescription>All your created cover letters and emails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <Spinner />
                      </div>
                    ) : historyItems.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No history items found</p>
                        <p className="text-gray-500 text-sm mt-2">Your generated cover letters and emails will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {historyItems.map((item) => (
                          <div key={item.id} className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {item.type === 'email' ? (
                                  <Mail className="w-5 h-5 text-blue-400" />
                                ) : (
                                  <FileText className="w-5 h-5 text-purple-400" />
                                )}
                                <div>
                                  <p className="text-white font-medium">{item.title}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                                      {item.type === 'email' ? 'Email' : 'Cover Letter'}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'Unknown date'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className='text-gray-400 hover:text-black'
                                  onClick={() => handleDeleteHistory(item.id)}
                                >
                                  <Trash className='w-4 h-4'/>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-400 hover:text-black"
                                  onClick={() => handleDownloadHistory(item)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-400 hover:text-black"
                                  onClick={() => handleViewHistory(item)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <>
                  <Card className="border-gray-800 bg-gray-900">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-purple-400" />
                        Notifications
                      </CardTitle>
                      <CardDescription>Manage your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: 'Email notifications for generated content', checked: true },
                        { label: 'Marketing and product updates', checked: false },
                        { label: 'Weekly usage reports', checked: true },
                        { label: 'Billing and payment reminders', checked: true }
                      ].map((setting, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                          <span className="text-gray-300">{setting.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={setting.checked} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-red-500/50 bg-gray-900">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Trash2 className="w-5 h-5 mr-2 text-red-400" />
                        Danger Zone
                      </CardTitle>
                      <CardDescription>Irreversible actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h4 className="text-red-400 font-semibold mb-2">Delete Account</h4>
                        <p className="text-gray-400 text-sm mb-4">
                          Once you delete your account, there is no going back. All your data will be permanently deleted.
                        </p>
                        <Button 
                          variant="outline" 
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-white"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          Delete My Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal setShowDeleteModal={setShowDeleteModal} />
      )}

      {/* History View Dialog */}
      {showHistoryDialog && selectedHistoryItem && (
        <HistoryModal
          selectedHistoryItem={selectedHistoryItem}
          handleDownloadHistory={handleDownloadHistory}
          handleDeleteHistory={handleDeleteHistory}
          setShowHistoryDialog={setShowHistoryDialog}
          setSelectedHistoryItem={setSelectedHistoryItem}
        />
      )}
    </div>
  );
}