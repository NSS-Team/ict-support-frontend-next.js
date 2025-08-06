'use client';

export default function TicketSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse mt-4">
      <div className="p-3 sm:p-6">
        {/* Compact Mobile Header */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between mb-4 sm:mb-6">
          {/* Mobile: Compact single row */}
          <div className="flex items-center justify-between sm:block">
            <div className="flex items-center gap-3">
              <div className="w-10 sm:w-12 h-4 bg-gray-300 rounded" />
              <div className="w-12 sm:w-16 h-4 bg-gray-400 rounded" />
            </div>
            <div className="w-14 sm:w-16 h-4 bg-red-300 rounded sm:hidden" />
          </div>

          {/* Title */}
          <div className="w-full sm:w-48 h-5 sm:h-6 bg-gray-300 rounded" />

          {/* Desktop Priority */}
          <div className="hidden sm:block w-16 h-5 bg-red-300 rounded" />
        </div>

        {/* Simplified Mobile Grid */}
        <div className="space-y-3 sm:space-y-0 sm:border-t sm:border-gray-100 sm:pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1 sm:space-y-2">
                <div className="w-16 sm:w-24 h-3 sm:h-4 bg-gray-300 rounded" />
                <div className="w-20 sm:w-36 h-4 sm:h-5 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}