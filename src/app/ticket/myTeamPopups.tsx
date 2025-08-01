'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { api } from '~/trpc/react'; // tRPC hooks
import { User2, X, Users, Clock, CheckCircle, Plus, Minus, UserPlus } from 'lucide-react';
import type { TeamWorker } from '~/types/teams/teamWorker';
import { useRouter } from 'next/navigation';

interface MyTeamPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  complainId: number;
  assignedWorkers: TeamWorker[] | undefined;
}

export default function MyTeamPopup({ open, setOpen, complainId, assignedWorkers }: MyTeamPopupProps) {
  const router = useRouter();
  
  // State for selected workers to assign
  const [selectedWorkers, setSelectedWorkers] = useState<TeamWorker[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // fetching the team workers
  const { data: getTeamWorkersResponse, refetch: refetchMyTeamWorkers, isLoading } = api.teams.getTeamWorkers.useQuery(undefined, { enabled: open });
  // api call to assign ticket to multiple workers
  const assignTicketToWorkers = api.complaints.assignComplainToWorkers.useMutation();
  const [workers, setWorkers] = useState<TeamWorker[]>([]);

  useEffect(() => {
    if (getTeamWorkersResponse) {
      // Filter out any undefined values before setting state
      const validWorkers = (getTeamWorkersResponse?.data?.workers || []).filter(
        (worker): worker is TeamWorker => worker !== undefined
      );
      setWorkers(validWorkers);
    }
  }, [getTeamWorkersResponse]);

  // Reset selected workers when popup opens
  useEffect(() => {
    if (open) {
      setSelectedWorkers([]);
    }
  }, [open]);

  // Function to check if a worker is already assigned
  const isWorkerAssigned = (workerId: number): boolean => {
    return assignedWorkers?.some(worker => worker.workerId === workerId) || false;
  };

  // Function to check if a worker is currently selected
  const isWorkerSelected = (workerId: number): boolean => {
    return selectedWorkers.some(worker => worker.workerId === workerId);
  };

  // Function to toggle worker selection
  const toggleWorkerSelection = (worker: TeamWorker) => {
    if (isWorkerSelected(worker.workerId)) {
      // Remove from selection
      setSelectedWorkers(prev => prev.filter(w => w.workerId !== worker.workerId));
    } else {
      // Add to selection
      setSelectedWorkers(prev => [...prev, worker]);
    }
  };

  // Get count of assigned workers
  const assignedCount = assignedWorkers?.length || 0;

  // handle assigning multiple workers
  const handleAssignWorkers = async () => {
    if (selectedWorkers.length === 0) return;
    
    try {
      setIsAssigning(true);
      
      // Create array of assignments
      const assignments = selectedWorkers.map(worker => worker.workerId);

      const response = await assignTicketToWorkers.mutateAsync({
        workerId: assignments,
        complaintId: complainId
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className={`w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200/60 transform transition-all duration-300 ${
            open ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}>

            {/* Enhanced Header */}
            <div className="relative px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200/50">
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-slate-900">
                      Assign Team Members
                    </Dialog.Title>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Select multiple members to assign this task
                      {assignedCount > 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {assignedCount} already assigned
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 hover:scale-105 group"
                >
                  <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                </button>
              </div>
            </div>

            {/* Currently Assigned Workers */}
            {assignedWorkers && assignedWorkers.length > 0 && (
              <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Currently Assigned:</h4>
                <div className="flex flex-wrap gap-2">
                  {assignedWorkers.map((worker) => (
                    <div key={worker.workerId} className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                      <span className="text-sm text-blue-800 font-medium">{worker.workerName}</span>
                      <span className="text-xs text-blue-600">#{worker.workerId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Workers Section */}
            {selectedWorkers.length > 0 && (
              <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-emerald-900">
                    Assign complaint to ({selectedWorkers.length} selected):
                  </h4>
                  <button
                    onClick={() => setSelectedWorkers([])}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedWorkers.map((worker) => (
                    <div key={worker.workerId} className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                      <UserPlus className="w-3 h-3 text-emerald-600" />
                      <span className="text-sm text-emerald-800 font-medium">{worker.workerName}</span>
                      <button
                        onClick={() => toggleWorkerSelection(worker)}
                        className="w-4 h-4 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center transition-colors"
                      >
                        <X className="w-2.5 h-2.5 text-emerald-700" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workers List */}
            <div className="px-6 py-5">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200"></div>
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                  <p className="text-slate-600 mt-4 animate-pulse">Loading team members...</p>
                </div>
              ) : workers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No team members available</p>
                  <p className="text-slate-400 text-sm mt-1">Add team members to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {workers?.map((worker: TeamWorker, index: number) => {
                    const isAssigned = isWorkerAssigned(worker.workerId);
                    const isSelected = isWorkerSelected(worker.workerId);
                    const canSelect = !isAssigned && worker.status !== 'busy';
                    
                    return (
                      <div
                        key={worker.workerId}
                        onClick={() => canSelect && toggleWorkerSelection(worker)}
                        className={`group flex items-center justify-between gap-4 p-4 border rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-blue-200 ${
                          isAssigned
                            ? 'border-green-200 bg-green-50/70'
                            : isSelected
                            ? 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200'
                            : worker.status === 'busy'
                            ? 'border-slate-200/60 bg-slate-50/70 opacity-75'
                            : 'border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                        tabIndex={canSelect ? 0 : -1}
                      >
                        {/* Left: Avatar + Info */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                              isAssigned
                                ? 'bg-gradient-to-br from-green-100 to-green-200'
                                : isSelected
                                ? 'bg-gradient-to-br from-emerald-100 to-emerald-200'
                                : 'bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-blue-200'
                            }`}>
                              <User2 className={`w-6 h-6 transition-colors duration-300 ${
                                isAssigned 
                                  ? 'text-green-600' 
                                  : isSelected
                                  ? 'text-emerald-600'
                                  : 'text-slate-600 group-hover:text-blue-600'
                              }`} />
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-white rounded-full shadow-sm ${
                              isAssigned
                                ? 'bg-green-500'
                                : isSelected
                                ? 'bg-emerald-500'
                                : worker.status === 'busy' 
                                ? 'bg-amber-400' 
                                : 'bg-slate-400'
                            }`}>
                              {isAssigned && (
                                <CheckCircle className="w-3 h-3 text-white absolute -top-0.5 -left-0.5" />
                              )}
                              {isSelected && !isAssigned && (
                                <Plus className="w-3 h-3 text-white absolute -top-0.5 -left-0.5" />
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`font-medium truncate transition-colors duration-300 ${
                                isAssigned 
                                  ? 'text-green-900' 
                                  : isSelected
                                  ? 'text-emerald-900'
                                  : 'text-slate-900 group-hover:text-blue-900'
                              }`}>
                                {worker.workerName}
                              </p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                                isAssigned
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : isSelected
                                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                  : worker.status === 'busy'
                                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                  isAssigned
                                    ? 'bg-green-400'
                                    : isSelected
                                    ? 'bg-emerald-400'
                                    : worker.status === 'busy' 
                                    ? 'bg-amber-400' 
                                    : 'bg-slate-400'
                                }`} />
                                {isAssigned ? 'Assigned' : isSelected ? 'Selected' : worker.status === 'busy' ? 'Busy' : 'Available'}
                              </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500 font-mono">
                              <p>ID: {worker.workerId}</p>
                              <div className="flex items-center text-xs text-slate-400 font-sans">
                                <Clock className="w-3 h-3 mr-1" />
                                Online
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Selection Button */}
                        {isAssigned ? (
                          <div className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Assigned
                          </div>
                        ) : worker.status === 'busy' ? (
                          <div className="px-4 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed opacity-60">
                            Busy
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWorkerSelection(worker);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 flex items-center gap-2 ${
                              isSelected
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-300'
                                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md focus:ring-blue-300'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Minus className="w-4 h-4" />
                                Remove
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                Select
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-transparent rounded-b-2xl">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-slate-600 font-medium">
                    {workers.filter(w => !isWorkerAssigned(w.workerId) && w.status !== 'busy').length} available
                  </p>
                </div>
                {assignedCount > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="text-sm text-blue-600 font-medium">
                      {assignedCount} assigned
                    </p>
                  </div>
                )}
                {selectedWorkers.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <p className="text-sm text-emerald-600 font-medium">
                      {selectedWorkers.length} selected
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  Cancel
                </button>
                
                {selectedWorkers.length > 0 && (
                  <button
                    onClick={handleAssignWorkers}
                    disabled={isAssigning}
                    className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                      isAssigning
                        ? 'bg-emerald-400 text-white cursor-wait'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white focus:ring-emerald-300'
                    }`}
                  >
                    {isAssigning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Assign {selectedWorkers.length} Worker{selectedWorkers.length !== 1 ? 's' : ''}
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