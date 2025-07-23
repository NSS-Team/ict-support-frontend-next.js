'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { api } from '~/trpc/react'; // tRPC hooks
import { User2, X, Users, Clock } from 'lucide-react';
import type { TeamWorker } from '~/types/teams/teamWorker';

export default function MyTeamPopup({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) {
  const { data: getTeamWorkersResponse, isLoading } = api.teams.getTeamWorkers.useQuery();
  const [workers, setWorkers] = useState<TeamWorker[]>([]);

  useEffect(() => {
    if (getTeamWorkersResponse) {
      setWorkers(getTeamWorkersResponse?.data?.workers || []);
    }
  }, [getTeamWorkersResponse]);

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
          <Dialog.Panel className={`w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/60 transform transition-all duration-300 ${
            open ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}>
            
            {/* Enhanced Header with gradient */}
            <div className="relative px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200/50">
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-slate-900">
                      Select Team Member
                    </Dialog.Title>
                    <p className="text-sm text-slate-500 mt-0.5">Choose a member to assign this task</p>
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

            {/* Content with staggered animations */}
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
                 {workers?.map((worker: TeamWorker, index: number) => (
  <div
    key={worker.workerId}
    className={`group flex items-center justify-between gap-4 p-4 border rounded-xl transition-transform duration-200 hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-blue-200 ${
      worker.status === 'busy'
        ? 'border-slate-200/60 bg-slate-50/70 opacity-75'
        : 'border-slate-200/60 hover:border-blue-200 hover:bg-blue-50/40'
    }`}
    style={{ animationDelay: `${index * 100}ms` }}
    tabIndex={0}
  >
    {/* Left: Avatar + Info */}
    <div className="flex items-center gap-4 flex-1">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-sm">
          <User2 className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-white rounded-full shadow-sm ${
          worker.status === 'busy' ? 'bg-amber-400' : 'bg-emerald-400'
        }`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-slate-900 truncate group-hover:text-blue-900 transition-colors duration-300">
            {worker.workerName}
          </p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
            worker.status === 'busy'
              ? 'bg-amber-100 text-amber-700 border-amber-200'
              : 'bg-emerald-100 text-emerald-700 border-emerald-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
              worker.status === 'busy' ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />
            {worker.status === 'busy' ? 'Busy' : 'Available'}
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

    {/* Right: Action */}
    {worker.status !== 'busy' ? (
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('Assigning to:', worker.workerName);
        }}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Assign
      </button>
    ) : (
      <div className="px-4 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed opacity-60">
        Busy
      </div>
    )}
  </div>
))}

                </div>
              )}
            </div>

            {/* Enhanced Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-transparent rounded-b-2xl">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600 font-medium">
                  {workers.length} {workers.length === 1 ? 'member' : 'members'} available
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                Cancel
              </button>
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