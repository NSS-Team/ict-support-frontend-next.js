'use client';

import { useState, useEffect } from 'react';
import { Clock, User2, ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-react';
import '~/styles/globals.css';
import type { ticket } from '~/types/tickets/ticket';
import { useRouter } from 'next/navigation';
import { complaintStatusLabelMap } from '~/lib/complaintStatusLabelMap';
import { priorityColorMap } from '~/lib/PriorityColorMap';
import { complaintStatusColorMap } from '~/lib/statusColorMap';

interface TicketProps {
  ticket?: ticket;
}

const ComplaintCard = ({ ticket }: TicketProps) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const readableStatus = ticket?.status ? complaintStatusLabelMap[ticket.status] : 'UNKNOWN';

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mt-4">
      <div className="p-4 sm:p-6">
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          {/* Top Row - ID and Status */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">#{ticket?.id}</span>
            <span className={`text-white text-xs font-medium rounded px-2 py-1 ${
              complaintStatusColorMap[ticket?.status?.toLowerCase() ?? ''] || complaintStatusColorMap.default
            }`}>
              {readableStatus}
            </span>
          </div>

          {/* Title Row */}
          <div className="mb-3">
            <div className="flex items-start gap-2 group">
              <h2
                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200 leading-tight flex-1"
                onClick={() => router.push(`/ticket/${ticket?.id}`)}
              >
                {ticket?.title}
              </h2>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200 flex-shrink-0 mt-0.5" />
            </div>
          </div>

          {/* Employee and Date Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-gray-600 gap-1.5">
              <User2 className="w-4 h-4" />
              <span className="text-sm">{ticket?.employeeName}</span>
            </div>
            <div className="flex items-center text-gray-500 gap-1.5">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'UNKNOWN'}</span>
            </div>
          </div>

          {/* Priority Row */}
          <div className="flex justify-end mb-4">
            <span className={`text-white text-xs font-medium px-2 py-1 rounded ${
              priorityColorMap[ticket?.priority?.toLowerCase() ?? ''] || priorityColorMap.default
            }`}>
              {ticket?.priority?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>

          {/* Toggle Button */}
          <div className="border-t border-gray-100 pt-3 mb-3">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expandable Details */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isExpanded
                ? 'max-h-64 opacity-100 border-t border-gray-100 pt-3'
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-gray-500 mb-1">Assigned Worker</dt>
                <dd className="text-sm text-gray-900">{ticket?.assignedWorkerId || 'Not assigned'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 mb-1">Preferred Mode</dt>
                <dd className="text-sm text-gray-900">{ticket?.submissionPreference || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 mb-1">Category</dt>
                <dd className="text-sm text-gray-900">{ticket?.categoryName || 'Not assigned'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 mb-1">Subcategory</dt>
                <dd className="text-sm text-gray-900">{ticket?.subCategoryName || 'Not assigned'}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout (sm and up) */}
        <div className="hidden sm:block">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              {/* ID and Status */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-500 mb-1">#{ticket?.id}</span>
                <span className={`text-white text-xs font-medium rounded px-2 py-1 ${
                  complaintStatusColorMap[ticket?.status?.toLowerCase() ?? ''] || complaintStatusColorMap.default
                }`}>
                  {readableStatus}
                </span>
              </div>

              {/* Title and Employee */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 group">
                  <h2
                    className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200 truncate"
                    onClick={() => router.push(`/ticket/${ticket?.id}`)}
                  >
                    {ticket?.title}
                  </h2>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200 flex-shrink-0" />
                </div>
                <div className="flex items-center text-gray-600 mt-2 gap-1.5">
                  <User2 className="w-4 h-4" />
                  <span className="text-sm">{ticket?.employeeName}</span>
                </div>
              </div>
            </div>

            {/* Date and Priority */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="flex items-center text-gray-500 gap-1.5">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'UNKNOWN'}</span>
              </div>
              <span className={`text-white text-xs font-medium px-2 py-1 rounded ${
                priorityColorMap[ticket?.priority?.toLowerCase() ?? ''] || priorityColorMap.default
              }`}>
                {ticket?.priority?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="border-t border-gray-100 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Assigned Worker</dt>
                <dd className="text-sm text-gray-900">{ticket?.assignedWorkerId || 'Not assigned'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Preferred Mode</dt>
                <dd className="text-sm text-gray-900">{ticket?.submissionPreference || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Category</dt>
                <dd className="text-sm text-gray-900">{ticket?.categoryName || 'Not assigned'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Subcategory</dt>
                <dd className="text-sm text-gray-900">{ticket?.subCategoryName || 'Not assigned'}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;