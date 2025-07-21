'use client';

export default function TicketSkeleton() {
  return (
    <div className="relative w-full max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse my-5">
      {/* Top Section Skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center min-w-[50px]">
            <div className="w-10 h-3 bg-gray-300 rounded mb-2" />
            <div className="w-12 h-4 bg-gray-400 rounded" />
          </div>

          <div>
            <div className="w-32 h-5 bg-gray-300 rounded mb-2" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full" />
              <div className="w-20 h-3 bg-gray-300 rounded" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full" />
            <div className="w-10 h-3 bg-gray-300 rounded" />
          </div>
          <div className="w-12 h-5 bg-red-300 rounded" />
        </div>
      </div>

      {/* Detail Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="w-20 h-3 bg-gray-300 rounded mb-1" />
            <div className="w-24 h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
