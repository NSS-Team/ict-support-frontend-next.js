'use client'

import { LogIn, UserPlus, Shield, ArrowRight } from 'lucide-react'
import { SignInButton, SignUpButton } from '@clerk/nextjs'

export default function LoginRequired() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Login Required
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Please sign in to your account to access this page and continue using our services.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <SignInButton mode="modal">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <LogIn className="w-4 h-4" />
                Sign In
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200">
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>
            </SignUpButton>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Status Code */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Status: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">Authentication Required</span>
          </p>
        </div>
      </div>
    </div>
  )
}