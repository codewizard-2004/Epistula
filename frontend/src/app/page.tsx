"use client";
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Github, Sparkles, FileText, Zap, Target, CheckCircle, Facebook } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, db, provider } from '@/services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard"); // or /pricing if it’s a new user
    }
  }, [user, loading, router]);

  if (user) {
    return null; // prevents flicker while redirecting
  }

  const handleGithubAuth = () => {
    console.log('GitHub auth initiated');
    // Add your GitHub OAuth logic here
  };

  const signInWithGoogle = async() => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Check if user already exists in Firestore
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      plan: "free",
      pricing: 0,
      term: "month",
      usageLeft: 10,
      history: [],
      createdAt: new Date(),
    });
    router.push("/pricing")
  }else{
    router.push("/dashboard")
  }

  return user;
}

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Left Side - Hero Section with Images */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Image Collage */}
        <div className="absolute inset-0">
          <div className="grid grid-cols-2 gap-2 h-full p-4 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80" 
              alt="Professional writing"
              className="w-full h-full object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80" 
              alt="Laptop and coffee"
              className="w-full h-full object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80" 
              alt="Person writing"
              className="w-full h-full object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80" 
              alt="Business documents"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-gray-900/95 to-gray-950/95"></div>
        </div>
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-purple-600 p-2 rounded-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Epistula</h1>
          </div>
          
          <div className="mt-16">
            <div className="inline-block mb-4">
              <span className="bg-purple-500/20 text-purple-300 text-sm font-semibold px-4 py-2 rounded-full border border-purple-500/30">
                AI-Powered Career Tool
              </span>
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Transform Your Job Hunt with Perfect Cover Letters
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Stand out from the competition with AI-crafted cover letters that showcase your unique value.
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-5">
              <div className="flex items-start space-x-4 group">
                <div className="bg-purple-600/20 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20 group-hover:bg-purple-600/30 transition-all">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Smart AI Writing</h3>
                  <p className="text-gray-400">Tailored content that matches job descriptions and company culture</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="bg-blue-600/20 backdrop-blur-sm rounded-lg p-3 border border-blue-500/20 group-hover:bg-blue-600/30 transition-all">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Create in Minutes</h3>
                  <p className="text-gray-400">Professional cover letters ready in under 2 minutes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div className="bg-emerald-600/20 backdrop-blur-sm rounded-lg p-3 border border-emerald-500/20 group-hover:bg-emerald-600/30 transition-all">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">ATS Optimized</h3>
                  <p className="text-gray-400">Beat applicant tracking systems and reach human recruiters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="bg-purple-600 p-2 rounded-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Epistula
            </h1>
          </div>

          <Card className="border border-gray-800 shadow-2xl bg-gray-900">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-3xl font-bold tracking-tight text-white">Welcome back</CardTitle>
              <CardDescription className="text-base text-gray-400">
                Sign in to continue crafting amazing cover letters
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium bg-white hover:bg-gray-100 text-gray-900 border-0 transition-all"
                onClick={signInWithGoogle}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all"
                onClick={handleGithubAuth}
              >
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all"
                onClick={handleGithubAuth}
              >
                <Facebook className="w-5 h-5 mr-3" />
                Continue with Facebook
              </Button>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 mt-3 px-4">
                By continuing, you agree to Epistula's{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}