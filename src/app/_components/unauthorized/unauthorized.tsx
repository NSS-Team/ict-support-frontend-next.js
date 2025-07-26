'use client'

import { Lock } from 'lucide-react'
import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <Lock className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">Unauthorized Access</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go back to Home
      </Link>
    </div>
  )
}
