'use client';

// this is just a display component for assigned workers in a ticket
// it shows the first worker and a dropdown for all assigned workers
import { useState } from 'react';
import { User, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import type { WorkerComplaintStatus } from '~/types/enums';

interface AssignedWorker {
  workerId: number;
  workerName: string;
  workerUserId?: string;
  teamId?: number;
  status?: WorkerComplaintStatus;
  picUrl?: string; // optional URL for worker's profile picture
}

interface AssignedWorkersCardProps {
  assignedWorkers: AssignedWorker[] | undefined;
}

export default function AssignedWorkersCard({ assignedWorkers }: AssignedWorkersCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log("Assigned Workers:", assignedWorkers);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500">Assigned To</p>
          {assignedWorkers && assignedWorkers.length > 0 ? (
            <div className="mt-1">
              <div className="relative">
                {/* Main Display - Clickable */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      {assignedWorkers[0]?.picUrl ? (
                        <Image 
                          src={assignedWorkers[0].picUrl} 
                          alt={assignedWorkers[0]?.workerName || 'Worker'} 
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                          {assignedWorkers[0]?.workerName?.charAt(0)?.toUpperCase() ?? 'U'}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900">
                        {assignedWorkers[0]?.workerName ?? 'Unknown'}
                      </p>
                      <div className="flex items-center gap-2">
                        {/* Status indicator for the first worker */}
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                          assignedWorkers[0]?.status === 'active' 
                            ? 'bg-green-100 text-green-700'
                            : assignedWorkers[0]?.status === 'in_queue'
                            ? 'bg-blue-100 text-blue-700'
                            : assignedWorkers[0]?.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {assignedWorkers[0]?.status === 'active' 
                            ? 'Active'
                            : assignedWorkers[0]?.status === 'in_queue'
                            ? 'In Queue'
                            : assignedWorkers[0]?.status === 'resolved'
                            ? 'Resolved'
                            : 'Unknown'}
                        </span>
                        {assignedWorkers.length > 1 && (
                          <p className="text-xs text-blue-600">
                            +{assignedWorkers.length - 1} more worker{assignedWorkers.length - 1 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Arrow */}
                  <div className={`text-blue-600 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Content - Conditional Rendering */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-2 max-h-48 overflow-y-auto">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-1 mb-1">
                        All Assigned Workers ({assignedWorkers.length})
                      </div>
                      {assignedWorkers.map((worker, index) => (
                        <div key={worker.workerId || index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                            {worker.picUrl ? (
                              <Image 
                                src={worker.picUrl} 
                                alt={worker.workerName || 'Worker'} 
                                width={28}
                                height={28}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                                {worker.workerName?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {worker.workerName || 'Unknown Worker'}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {worker.workerId || 'N/A'}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              worker.status === 'active' 
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : worker.status === 'in_queue'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : worker.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                worker.status === 'active' 
                                  ? 'bg-green-400'
                                  : worker.status === 'in_queue'
                                  ? 'bg-blue-400'
                                  : worker.status === 'resolved'
                                  ? 'bg-emerald-400'
                                  : 'bg-gray-400'
                              }`}></span>
                              {worker.status === 'active' 
                                ? 'Active'
                                : worker.status === 'in_queue'
                                ? 'In Queue'
                                : worker.status === 'resolved'
                                ? 'Resolved'
                                : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Total Assigned: {assignedWorkers.length}
                </p>
                <p className="text-xs text-blue-600">
                  Click to expand
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 font-medium">Unassigned</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}