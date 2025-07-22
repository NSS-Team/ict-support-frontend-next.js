'use client';

export default function TicketSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse mt-4">
      <div className="p-6">
        {/* Top Section Skeleton */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {/* ID and Status */}
            <div className="flex flex-col items-start">
              <div className="w-12 h-4 bg-gray-300 rounded mb-2" />
              <div className="w-16 h-5 bg-gray-400 rounded" />
            </div>

            {/* Title and Employee */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="w-48 h-6 bg-gray-300 rounded" />
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
                <div className="w-24 h-4 bg-gray-300 rounded" />
              </div>
            </div>
          </div>

          {/* Date and Priority */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full" />
              <div className="w-20 h-4 bg-gray-300 rounded" />
            </div>
            <div className="w-16 h-5 bg-red-300 rounded" />
          </div>
        </div>

        {/* Details Grid Skeleton */}
        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-24 h-4 bg-gray-300 rounded" />
                <div className="w-36 h-5 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
