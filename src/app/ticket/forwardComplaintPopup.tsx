'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { api } from '~/trpc/react';
import { Users, X, ShieldCheck, MessageSquare } from 'lucide-react';
import type { Team } from '~/types/teams/team';
import { useToast } from '../_components/ToastProvider';

interface ForwardTeamPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  complainId: string; // Optional, if you want to use this in the future
  MyTeamId: number | null;
}

export default function ForwardTeamPopup({ open, setOpen, complainId, MyTeamId }: ForwardTeamPopupProps) {

  const {addToast: _addToast} = useToast();

  // fetching the teams api
  const { data: getTeamsResponse, refetch: _refetchTeams, isLoading: teamsLoading, isError: getTeamsError } = api.teams.getTeams.useQuery(undefined, {
    enabled: open, // Only fetch when the popup is open
  });
  const teams = getTeamsResponse?.data?.teams ?? [];

  // api that triggers when forward complaint button is clicked
  const forwardComplaint = api.complaints.forwardComplainToTeam.useMutation({
    onSuccess: () => {
      // Show success toast
      console.log('Complaint forwarded successfully');
      setOpen(false);
    },
  });

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [message, setMessage] = useState('');

  // Reset selection when popup opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedTeam(null);
      setMessage('');
    }
  }, [open]);

  const handleForward = () => {
    if (selectedTeam && message.trim()) {
      forwardComplaint.mutate({
        teamId: selectedTeam.id,
        comment: message.trim(),
        complaintId: complainId,
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/20 via-slate-800/30 to-slate-900/40 backdrop-blur-sm transition-all duration-300" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/60 transform transition-all duration-300">
          <div className="relative px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-200/50">
                  <ShieldCheck className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-slate-900">
                    Forward to Team
                  </Dialog.Title>
                  <p className="text-sm text-slate-500 mt-0.5">Choose a team to forward the complaint</p>
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

          <div className="px-6 py-5">
            {teamsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200"></div>
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <p className="text-slate-600 mt-4 animate-pulse">Loading teams...</p>
              </div>
            ) : getTeamsError ? (
              <div className="text-center py-12">
                <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-slate-600 font-medium">Error loading teams</p>
                <p className="text-slate-400 text-sm mt-1">Please try again later</p>
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No teams available</p>
                <p className="text-slate-400 text-sm mt-1">Create a team to proceed</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar mb-6">
                  {/* Only show teams not equal to the user's team id */}
                  {(teams as Team[])
                    .filter((team: Team) => team.id !== MyTeamId)
                    .map((team: Team, index: number) => (
                      <div
                        key={team.id}
                        onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}
                        className={`group flex items-center gap-4 p-4 border rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${selectedTeam?.id === team.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-slate-200 hover:border-blue-300'
                          }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative shrink-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${selectedTeam?.id === team.id
                                ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                                : 'bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-blue-200'
                              }`}>
                              <Users className={`w-6 h-6 transition-colors duration-300 ${selectedTeam?.id === team.id
                                  ? 'text-blue-600'
                                  : 'text-slate-600 group-hover:text-blue-600'
                                }`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`font-medium truncate transition-colors duration-300 ${selectedTeam?.id === team.id
                                  ? 'text-blue-900'
                                  : 'text-slate-900 group-hover:text-blue-900'
                                }`}>
                                {team.name}
                              </p>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                              <ShieldCheck className="w-4 h-4" />
                              <span>Manager: {team.managerName ?? 'No manager assigned'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Selection indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${selectedTeam?.id === team.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-300'
                          }`}>
                          {selectedTeam?.id === team.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Message Field */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className={`w-4 h-4 ${selectedTeam ? 'text-blue-600' : 'text-slate-400'}`} />
                    <label className={`text-sm font-medium ${selectedTeam ? 'text-slate-700' : 'text-slate-400'}`}>
                      Forward Message
                    </label>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!selectedTeam}
                    placeholder={selectedTeam ? "Add a message with your forwarding request..." : "Select a team to enable message field"}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl resize-none transition-all duration-200 ${selectedTeam
                        ? 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-slate-900'
                        : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                      }`}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-transparent rounded-b-2xl">
            <button
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              Cancel
            </button>

            <button
              onClick={handleForward}
              disabled={!selectedTeam || !message.trim()}
              className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${selectedTeam && message.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              Forward to Team
            </button>
          </div>
        </Dialog.Panel>
      </div>

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
    </Dialog>
  );
}