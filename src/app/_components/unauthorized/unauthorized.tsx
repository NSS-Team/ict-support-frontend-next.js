'use client'

import { Lock, Home, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Need help? Contact support at</span>
              <a href="mailto:support@company.com" className="text-blue-600 hover:text-blue-700 font-medium">
                support@company.com
              </a>
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Error Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">403</span>
          </p>
        </div>
      </div>
    </div>
  )
}