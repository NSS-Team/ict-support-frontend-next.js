'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { api } from '~/trpc/react'; // tRPC hooks
import { User2, X, Users, Clock, CheckCircle, Plus, Minus, UserPlus } from 'lucide-react';
import type { WorkerAssignment } from '~/types/teams/workerAssignment';
import { useRouter } from 'next/navigation';

interface MyTeamPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  complaintId: number;
  assignedWorkers: WorkerAssignment[] | undefined;
  mode?: string;
}

export default function MyTeamPopup({ open, setOpen, complaintId, assignedWorkers, mode = "default" }: MyTeamPopupProps) {
  const router = useRouter();
  
  // State for selected workers to assign
  const [selectedWorkers, setSelectedWorkers] = useState<WorkerAssignment[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // fetching the team workers
  const { data: getTeamWorkersResponse, isLoading } = api.teams.getWorkersWhileAssignment.useQuery({ complaintId }, { enabled: open });
  // api call to assign ticket to multiple workers
  const assignTicketToWorkers = api.complaints.assignComplainToWorkers.useMutation();
  const [workers, setWorkers] = useState<WorkerAssignment[]>([]);

  useEffect(() => {
    if (getTeamWorkersResponse) {
      // Filter out any undefined values before setting state
      const validWorkers = (getTeamWorkersResponse?.data?.workers ?? []).filter((worker) => worker !== undefined) as WorkerAssignment[];
      setWorkers(validWorkers);
    }
  }, [getTeamWorkersResponse]);

  // Reset selected workers when popup opens
  useEffect(() => {
    if (open) {
      setSelectedWorkers([]);
    }
  }, [open]);

  // Function to check if a worker is already assigned to this complaint
  const isWorkerAssigned = (worker: WorkerAssignment): boolean => {
    // Use the isAssignedToThisComplaint property if available, fallback to checking assignedWorkers array
    if (worker.hasOwnProperty('isAssignedToThisComplaint')) {
      return worker.isAssignedToThisComplaint ?? false;
    }
    return assignedWorkers?.some(assignedWorker => assignedWorker.workerId === worker.workerId) ?? false;
  };

  // Function to check if a worker is currently selected
  const isWorkerSelected = (workerId: number): boolean => {
    return selectedWorkers.some(worker => worker.workerId === workerId);
  };

  // Function to toggle worker selection
  const toggleWorkerSelection = (worker: WorkerAssignment) => {
    if (isWorkerSelected(worker.workerId)) {
      // Remove from selection
      setSelectedWorkers(prev => prev.filter(w => w.workerId !== worker.workerId));
    } else {
      // Add to selection
      setSelectedWorkers(prev => [...prev, worker]);
    }
  };

  // Get count of assigned workers
  const assignedCount = assignedWorkers?.length ?? 0;

  // handle assigning multiple workers
  const handleAssignWorkers = async () => {
    if (selectedWorkers.length === 0) return;
    
    try {
      setIsAssigning(true);
      
      // Create array of assignments
      const assignments = selectedWorkers.map(worker => worker.workerId);

      const response = await assignTicketToWorkers.mutateAsync({
        workerId: assignments,
        complaintId: complaintId
      });
      
      console.log('Workers assigned successfully:', response);
      router.refresh(); // Refresh the page to reflect changes
      setOpen(false); // Close popup
      setSelectedWorkers([]); // Clear selections
    } catch (error) {
      console.error('Error assigning workers:', error);
      // Optionally show toast/notification
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        {/* Animated backdrop */}
        <div
          className={`fixed inset-0 bg-gradient-to-br from-slate-900/20 via-slate-800/30 to-slate-900/40 backdrop-blur-sm transition-all duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className={`w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200/60 transform transition-all duration-300 overflow-hidden ${
            open ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}>

            {/* Enhanced Header */}
            <div className="relative px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60 rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200/50 flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                      Assign Team Members
                    </Dialog.Title>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                      Select multiple members to assign this task
                      {assignedCount > 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {assignedCount} already assigned
                        </span>
                      )}
                    </p>
                    {/* Mobile-only simplified subtitle */}
                    <p className="text-xs text-slate-500 mt-0.5 sm:hidden">
                      Select workers to assign
                      {assignedCount > 0 && (
                        <span className="ml-1 text-blue-600 font-medium">({assignedCount} assigned)</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/80 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 group flex-shrink-0 touch-manipulation"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-600" />
                </button>
              </div>
            </div>

            {/* Currently Assigned Workers */}
            {assignedWorkers && assignedWorkers.length > 0 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50/50 border-b border-blue-100">
                <h4 className="text-xs sm:text-sm font-medium text-blue-900 mb-2">Currently Assigned:</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {assignedWorkers.map((worker) => (
                    <div key={`${mode}-complaint-${complaintId}-assigned-${worker.workerId}`} className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-100 rounded-full">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-blue-800 font-medium truncate">{worker.workerName}</span>
                      <span className="text-xs text-blue-600 hidden sm:inline">#{worker.workerId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Workers Section */}
            {selectedWorkers.length > 0 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-emerald-50/50 border-b border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs sm:text-sm font-medium text-emerald-900">
                    <span className="sm:hidden">Selected ({selectedWorkers.length}):</span>
                    <span className="hidden sm:inline">Assign complaint to ({selectedWorkers.length} selected):</span>
                  </h4>
                  <button
                    onClick={() => setSelectedWorkers([])}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium touch-manipulation"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedWorkers.map((worker) => (
                    <div key={`${mode}-complaint-${complaintId}-selected-${worker.workerId}`} className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-emerald-100 rounded-full">
                      <UserPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-emerald-800 font-medium truncate">{worker.workerName}</span>
                      <button
                        onClick={() => toggleWorkerSelection(worker)}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center transition-colors touch-manipulation flex-shrink-0"
                      >
                        <X className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-700" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workers List */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 flex-1 overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-slate-200"></div>
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                  <p className="text-slate-600 mt-3 sm:mt-4 animate-pulse text-sm sm:text-base">Loading team members...</p>
                </div>
              ) : workers.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="p-3 sm:p-4 bg-slate-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium text-sm sm:text-base">No team members available</p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">Add team members to get started</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto custom-scrollbar">
                  {workers?.map((worker: WorkerAssignment, index: number) => {
                    const isAssigned = isWorkerAssigned(worker);
                    const isSelected = isWorkerSelected(worker.workerId);
                    const isBusyButNear = worker.status === 'busy' && worker.near === true;
                    const isBusyAndFar = worker.status === 'busy' && worker.near === false;
                    const canSelect = !isAssigned && !isBusyAndFar;
                    const isRecommended = isBusyButNear;
                    const queueCount = worker.queueCount ?? 0;
                    
                    // Create a highly unique key using mode, complaintId, and workerId to prevent conflicts
                    const uniqueKey = `${mode}-complaint-${complaintId}-worker-${worker.workerId}-idx-${index}`;
                    
                    return (
                      <div
                        key={uniqueKey}
                        onClick={() => canSelect && toggleWorkerSelection(worker)}
                        className={`group flex items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 border rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-blue-200 touch-manipulation ${
                          isAssigned
                            ? 'border-green-200 bg-green-50/70'
                            : isSelected
                            ? 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200'
                            : isRecommended
                            ? 'border-orange-300 bg-orange-50 ring-2 ring-orange-200 cursor-pointer'
                            : isBusyAndFar
                            ? 'border-slate-200/60 bg-slate-50/70 opacity-75'
                            : 'border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                        tabIndex={canSelect ? 0 : -1}
                      >
                        {/* Left: Avatar + Info */}
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                              isAssigned
                                ? 'bg-gradient-to-br from-green-100 to-green-200'
                                : isSelected
                                ? 'bg-gradient-to-br from-emerald-100 to-emerald-200'
                                : isRecommended
                                ? 'bg-gradient-to-br from-orange-100 to-orange-200'
                                : 'bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-blue-200'
                            }`}>
                              <User2 className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                                isAssigned 
                                  ? 'text-green-600' 
                                  : isSelected
                                  ? 'text-emerald-600'
                                  : isRecommended
                                  ? 'text-orange-600'
                                  : 'text-slate-600 group-hover:text-blue-600'
                              }`} />
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white rounded-full shadow-sm ${
                              isAssigned
                                ? 'bg-green-500'
                                : isSelected
                                ? 'bg-emerald-500'
                                : isRecommended
                                ? 'bg-orange-500'
                                : isBusyAndFar 
                                ? 'bg-red-500' 
                                : 'bg-slate-400'
                            }`}>
                              {isAssigned && (
                                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white absolute -top-0.5 -left-0.5" />
                              )}
                              {isSelected && !isAssigned && (
                                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white absolute -top-0.5 -left-0.5" />
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                                <p className={`font-medium truncate transition-colors duration-300 text-sm sm:text-base ${
                                  isAssigned 
                                    ? 'text-green-900' 
                                    : isSelected
                                    ? 'text-emerald-900'
                                    : isRecommended
                                    ? 'text-orange-900'
                                    : 'text-slate-900 group-hover:text-blue-900'
                                }`}>
                                  {worker.workerName}
                                </p>
                                {isRecommended && (
                                  <span className="px-1.5 py-0.5 sm:px-2 text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200 rounded-full whitespace-nowrap">
                                    <span className="hidden sm:inline">Recommended</span>
                                    <span className="sm:hidden">Rec</span>
                                  </span>
                                )}
                              </div>
                              <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap ${
                                isAssigned
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : isSelected
                                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                  : isRecommended
                                  ? 'bg-orange-100 text-orange-700 border-orange-200'
                                  : isBusyAndFar
                                  ? 'bg-red-100 text-red-700 border-red-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-1 ${
                                  isAssigned
                                    ? 'bg-green-400'
                                    : isSelected
                                    ? 'bg-emerald-400'
                                    : isRecommended
                                    ? 'bg-orange-400'
                                    : isBusyAndFar 
                                    ? 'bg-red-400' 
                                    : 'bg-slate-400'
                                }`} />
                                {isAssigned 
                                  ? 'Assigned' 
                                  : isSelected 
                                  ? 'Selected' 
                                  : isRecommended
                                  ? <span><span className="sm:hidden">Busy</span><span className="hidden sm:inline">{`Busy (${queueCount ? `${queueCount} tasks` : 'Near'})`}</span></span>
                                  : isBusyAndFar 
                                  ? <span><span className="sm:hidden">Busy</span><span className="hidden sm:inline">Busy (Far)</span></span>
                                  : 'Available'}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 font-mono">
                              <p>ID: {worker.workerId}</p>
                              {queueCount && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-slate-400 hidden sm:inline">Queue:</span>
                                  <span className="text-xs text-slate-400 sm:hidden">Q:</span>
                                  <span className={`px-1 sm:px-1.5 py-0.5 rounded text-xs font-medium ${
                                    queueCount > 2 
                                      ? 'bg-red-100 text-red-700' 
                                      : queueCount > 1 
                                      ? 'bg-orange-100 text-orange-700'
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {queueCount}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center text-xs text-slate-400 font-sans">
                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                <span className="hidden sm:inline">Online</span>
                                <span className="sm:hidden">On</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Selection Button */}
                        {isAssigned ? (
                          <div className="px-2 py-1 sm:px-4 sm:py-2 bg-green-100 text-green-700 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Assigned</span>
                            <span className="sm:hidden">✓</span>
                          </div>
                        ) : isBusyAndFar ? (
                          <div className="px-2 py-1 sm:px-4 sm:py-2 bg-red-200 text-red-600 text-xs sm:text-sm font-medium rounded-lg cursor-not-allowed opacity-60 flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Busy (Far)</span>
                            <span className="sm:hidden">Busy</span>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWorkerSelection(worker);
                            }}
                            className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 flex items-center gap-1 sm:gap-2 flex-shrink-0 touch-manipulation ${
                              isSelected
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-300'
                                : isRecommended
                                ? 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-300 shadow-md'
                                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md focus:ring-blue-300'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Remove</span>
                                <span className="sm:hidden">-</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">
                                  {isRecommended 
                                    ? `Select (${queueCount ? `${queueCount} tasks` : 'Near'})` 
                                    : 'Select'}
                                </span>
                                <span className="sm:hidden">+</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Enhanced Footer with Assign Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-transparent rounded-b-xl sm:rounded-b-2xl gap-3 sm:gap-0">
              {/* Stats - Stack on mobile, horizontal on desktop */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-slate-600 font-medium">
                    {workers.filter(w => !isWorkerAssigned(w) && w.status !== 'busy').length} 
                    <span className="hidden sm:inline"> available</span>
                    <span className="sm:hidden"> avail</span>
                  </p>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <p className="text-orange-600 font-medium">
                    {workers.filter(w => !isWorkerAssigned(w) && w.status === 'busy' && w.near === true).length} 
                    <span className="hidden sm:inline"> recommended</span>
                    <span className="sm:hidden"> rec</span>
                  </p>
                </div>
                {assignedCount > 0 && (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
                    <p className="text-blue-600 font-medium">
                      {assignedCount} 
                      <span className="hidden sm:inline"> assigned</span>
                    </p>
                  </div>
                )}
                {selectedWorkers.length > 0 && (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full"></div>
                    <p className="text-emerald-600 font-medium">
                      {selectedWorkers.length} 
                      <span className="hidden sm:inline"> selected</span>
                    </p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg sm:rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 touch-manipulation"
                >
                  Cancel
                </button>
                
                {selectedWorkers.length > 0 && (
                  <button
                    onClick={handleAssignWorkers}
                    disabled={isAssigning}
                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 touch-manipulation ${
                      isAssigning
                        ? 'bg-emerald-400 text-white cursor-wait'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white focus:ring-emerald-300'
                    }`}
                  >
                    {isAssigning ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Assigning...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">
                          Assign {selectedWorkers.length} Worker{selectedWorkers.length !== 1 ? 's' : ''}
                        </span>
                        <span className="sm:hidden">
                          Assign ({selectedWorkers.length})
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}