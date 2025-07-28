'use client'

import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorDisplayProps {
  title?: string
  message?: string
  showRefresh?: boolean
  showHome?: boolean
  showBack?: boolean
  onRefresh?: () => void
  className?: string
}

export default function ErrorDisplay({
  title = "Unable to Load Content",
  message = "We encountered an error while loading the content. Please try refreshing the page or contact support if the issue persists.",
  showRefresh = false,
  showHome = true,
  showBack = true,
  onRefresh,
  className = ""
}: ErrorDisplayProps) {
  const router = useRouter()

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-xl shadow-lg border border-red-100 p-8 max-w-md mx-auto">
        {/* Error Icon */}
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <div className="p-2 bg-red-50 rounded-full">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <span className="font-semibold">{title}</span>
        </div>

        {/* Error Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Action - Refresh */}
          {showRefresh && (
            <button
              onClick={handleRefresh}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}

          {/* Secondary Actions */}
          <div className={`flex gap-3 ${showRefresh ? '' : 'flex-col'}`}>
            {showBack && (
              <button
                onClick={() => router.back()}
                className={`${showRefresh ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 px-4 py-2 ${showRefresh ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-900 hover:bg-gray-800 text-white'} font-medium rounded-lg transition-colors duration-200`}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            )}

            {showHome && (
              <button
                onClick={() => router.push('/')}
                className={`${showRefresh ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200`}
              >
                <Home className="h-4 w-4" />
                Home
              </button>
            )}
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Still having issues? Contact support at{' '}
            <a href="mailto:support@company.com" className="text-blue-600 hover:text-blue-700 font-medium">
              support@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}