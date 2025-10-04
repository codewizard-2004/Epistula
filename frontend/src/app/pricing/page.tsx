"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, FileText, Zap, Infinity, Search, Mail, Crown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started with cover letters',
      features: [
        { name: 'Standard generation speed', included: true, icon: Zap },
        { name: '5 cover letters per month', included: true, icon: FileText },
        { name: 'Basic templates', included: true, icon: Sparkles },
        { name: 'Find similar jobs', included: false, icon: Search },
        { name: 'Email mode', included: false, icon: Mail },
        { name: 'Priority support', included: false, icon: Crown },
      ],
      cta: 'Get Started',
      popular: false,
    },
    pro: {
      name: 'Pro',
      price: { monthly: 19, yearly: 190 },
      description: 'For serious job seekers who want the best',
      features: [
        { name: 'Lightning-fast generation', included: true, icon: Zap },
        { name: 'Unlimited cover letters', included: true, icon: Infinity },
        { name: 'Premium templates & customization', included: true, icon: Sparkles },
        { name: 'AI-powered job matching', included: true, icon: Search },
        { name: 'Email mode for direct sending', included: true, icon: Mail },
        { name: '24/7 priority support', included: true, icon: Crown },
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
  };

  const { user, profile, loading } = useAuth();
  console.log(user?.photoURL)

  const router = useRouter();

  const handleClickFree = () => {
    router.push("/dashboard");
  }

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
          <div className='flex flex-row gap-3'>
          {user?.photoURL && (
            <Image
              src={user.photoURL}
              alt={user.displayName ?? "User"}
              width={40}
              height={40}
              className="rounded-full border border-gray-700"
            />
          )}
          <Button variant="ghost" className="text-gray-300 hover:text-black">
            Sign Out
          </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="inline-block mb-4">
          <span className="bg-purple-500/20 text-purple-300 text-sm font-semibold px-4 py-2 rounded-full border border-purple-500/30">
            Simple, Transparent Pricing
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Start free and upgrade when you're ready to supercharge your job search
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors hover:bg-gray-600"
          >
            <div className={`absolute top-1 left-1 w-5 h-5 bg-purple-600 rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`} />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
              Save 17%
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="border-gray-800 bg-gray-900 relative overflow-hidden">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl text-white">{plans.free.name}</CardTitle>
              <CardDescription className="text-gray-400 text-base">
                {plans.free.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold text-white">${plans.free.price[billingCycle]}</span>
                <span className="text-gray-400 ml-2">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleClickFree} className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">
                {plans.free.cta}
              </Button>
              <div className="space-y-3 pt-4">
                {plans.free.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-purple-500/50 bg-gradient-to-br from-gray-900 to-purple-900/20 relative overflow-hidden shadow-2xl shadow-purple-900/50">
            {plans.pro.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
            )}
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl text-white flex items-center">
                {plans.pro.name}
                <Crown className="w-5 h-5 text-yellow-400 ml-2" />
              </CardTitle>
              <CardDescription className="text-gray-400 text-base">
                {plans.pro.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold text-white">${plans.pro.price[billingCycle]}</span>
                <span className="text-gray-400 ml-2">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-purple-900/50">
                {plans.pro.cta}
              </Button>
              <div className="space-y-3 pt-4">
                {plans.pro.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 font-medium">
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400">Yes! You can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2">What's included in the free trial?</h4>
              <p className="text-gray-400">Get full access to all Pro features for 7 days. No credit card required.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-gray-400">Yes, we offer a 30-day money-back guarantee if you're not satisfied.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2025 Epistula. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}