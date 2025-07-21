'use client';

import { useState, useEffect } from 'react';
import { Clock, User2, ChevronDown, ChevronUp, Router } from 'lucide-react';
import '~/styles/globals.css';
import type { ticket } from '~/types/tickets/ticket';
import { useRouter } from 'next/navigation';

interface TicketProps {
  ticket?: ticket;
}

const ComplaintCard = ({ ticket }: TicketProps) => {

  const Router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

const statusMap: Record<string, string> = {
  waiting_assignment: "WAITING",
  assigned: "ASSIGNED",
  in_progress: "IN PROGRESS",
  resolved: "RESOLVED",
  closed: "CLOSED",
  escalated_level_1: "ESCALATED LEVEL 1",
  escalated_level_2: "ESCALATED LEVEL 2",
};
  
const readableStatus = ticket?.status ? statusMap[ticket.status] : 'UNKNOWN';

  // Detect screen size for mobile
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl p-4 transition-all duration-300 mt-5">
      {/* Top Section */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center min-w-[50px]">
            <span className="text-xs text-gray-400 font-mono">#{ticket?.id}</span>
            <span className="bg-gray-800 text-white text-[10px] font-semibold rounded px-2 py-0.5 mt-1">
              {readableStatus}
            </span>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900 hover:text-blue-600 cursor-pointer" onClick={() => 
                    Router.push(`/ticket/${ticket?.id}`)
                } >{ticket?.title}</h2>
            <div className="flex items-center text-gray-600 text-sm gap-1 mt-1">
              <User2 className="w-4 h-4" />
              {ticket?.employeeName}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end text-sm">
          <div className="flex items-center text-gray-500 gap-1">
            <Clock className="w-4 h-4" />
            <span>07/07</span>
          </div>
          <div className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded mt-1 shadow-sm">
            {ticket?.priority.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Toggle */}
      {isMobile && (
        <div className="flex justify-center mt-2">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Details Section */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600 mt-4 transition-all duration-300 ease-in-out
        ${
          isMobile
            ? isExpanded
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
            : 'opacity-100 max-h-fit'
        }`}
      >
        <div>
          <span className="block font-semibold text-gray-500">Worker</span>
          <span className="text-gray-700">NOT ASSIGNED</span>
        </div>
        <div>
          <span className="block font-semibold text-gray-500">Preferred Mode</span>
          <span className="text-black font-medium">OnSite</span>
        </div>
        <div>
          <span className="block font-semibold text-gray-500">Category</span>
          <span className="text-gray-700">NOT ASSIGNED</span>
        </div>
        <div>
          <span className="block font-semibold text-gray-500">Subcategory</span>
          <span className="text-gray-700">NOT ASSIGNED</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
