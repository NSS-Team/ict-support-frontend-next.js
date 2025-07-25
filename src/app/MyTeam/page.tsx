'use client';

import { useState, useEffect } from 'react';
import { api } from '~/trpc/react';
import {
  Users, UserCheck, Mail, Phone, Calendar, MapPin, Badge,
  ChevronDown, ChevronUp, Clock, Building, User
} from 'lucide-react';
import Sidebar from '~/app/_components/Sidebar';
import type { TeamWorker } from '~/types/teams/teamWorker';
import { StatCard, InfoBlock, LoadingUI, ErrorUI, EmptyUI } from './reusableCompos';

export default function MyTeamPage() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [workers, setWorkers] = useState<TeamWorker[]>([]);

  const { data: getTeamWorkersResponse, isLoading, isError } = api.teams.getTeamWorkers.useQuery();

  const { data: userInfo, isLoading: isUserInfoLoading } = api.users.getUserInfo.useQuery(
    { id: selectedUserId ?? '' },
    {
      enabled: !!selectedUserId,
    }
  );

  useEffect(() => {
    if (getTeamWorkersResponse) {
      setWorkers(getTeamWorkersResponse?.data?.workers || []);
    }
  }, [getTeamWorkersResponse]);

  const toggleMemberExpansion = (memberId: number, userId: string) => {
    const isExpanding = expandedMember !== memberId;
    setExpandedMember(isExpanding ? memberId : null);
    setSelectedUserId(isExpanding ? userId : null);
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      manager: 'bg-blue-100 text-blue-800 border-blue-200',
      employee: 'bg-gray-100 text-gray-800 border-gray-200',
      worker: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[role as keyof typeof colors] || colors.employee;
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName && firstName.length > 0 ? firstName[0] : '';
    const lastInitial = lastName && lastName.length > 0 ? lastName[0] : '';
    return ((firstInitial ?? '') + (lastInitial ?? '')).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const updated = new Date(date);
    const diffInHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(updated);
  };

  // Get role statistics
  const roleStats = workers.reduce((acc, worker) => {
    // Note: You might need to fetch user info for each worker to get role stats
    // This is a placeholder implementation
    acc.total = workers.length;
    acc.active = workers.filter(w => w.status === 'active').length;
    return acc;
  }, { total: 0, active: 0 });

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200/50">
                  <Users className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Team</h1>
                  <p className="text-slate-500 mt-1">Manage and view your team members</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard 
                  label="Total Members" 
                  value={roleStats.total} 
                  icon={<Users className="w-8 h-8 text-blue-500" />} 
                />
                <StatCard 
                  label="Active Members" 
                  value={roleStats.active} 
                  icon={<UserCheck className="w-8 h-8 text-green-500" />} 
                  color="text-green-600" 
                />
                {/* <StatCard 
                  label="Managers" 
                  value={0} // You'll need to implement this based on fetched user data
                  icon={<Badge className="w-8 h-8 text-purple-500" />} 
                  color="text-purple-600" 
                />
                <StatCard 
                  label="Employees" 
                  value={0} // You'll need to implement this based on fetched user data
                  icon={<User className="w-8 h-8 text-orange-500" />} 
                  color="text-orange-600" 
                /> */}
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60">
              <div className="p-6 border-b border-slate-200/60">
                <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
                <p className="text-sm text-slate-500 mt-1">Click on any member to view detailed information</p>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <LoadingUI />
                ) : isError ? (
                  <ErrorUI />
                ) : workers.length === 0 ? (
                  <EmptyUI />
                ) : (
                  <div className="space-y-3">
                    {workers.map(member => (
                      <div
                        key={member.workerId}
                        className="group border border-slate-200 rounded-xl transition-all duration-300 hover:shadow-md hover:border-blue-300 overflow-hidden"
                      >
                        {/* Header */}
                        <div
                          onClick={() => toggleMemberExpansion(member.workerId, member.workerUserId)}
                          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-all"
                        >
                          <div className="relative shrink-0">
                            {userInfo?.data?.picUrl && expandedMember === member.workerId ? (
                              <img
                                src={userInfo.data.picUrl}
                                alt={member.workerName}
                                className="w-12 h-12 rounded-xl object-cover"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {getInitials(member.workerName.split(' ')[0] || '', member.workerName.split(' ')[1] || '')}
                                </span>
                              </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${member.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-slate-900 truncate">{member.workerName}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(member.status)}`}>
                                {member.status}
                              </span>
                            </div>
                            <div className="flex gap-4 text-sm text-slate-500">
                              {expandedMember === member.workerId && userInfo?.data && (
                                <>
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{userInfo.data.email}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getRoleColor(userInfo.data.role)}`}>
                                      {userInfo.data.role}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {expandedMember === member.workerId ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Info */}
                        {expandedMember === member.workerId && (
                          <div className="border-t border-slate-100 bg-slate-50/50">
                            {isUserInfoLoading ? (
                              <div className="p-4 text-sm text-slate-500 italic flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                Loading user information...
                              </div>
                            ) : userInfo?.data ? (
                              <div className="p-4">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                                  <InfoBlock 
                                    icon={Mail} 
                                    label="Email" 
                                    value={userInfo.data.email} 
                                  />
                                  <InfoBlock 
                                    icon={Phone} 
                                    label="Phone" 
                                    value={userInfo.data.phone || 'Not provided'} 
                                  />
                                  <InfoBlock 
                                    icon={Badge} 
                                    label="Role" 
                                    value={userInfo.data.role.charAt(0).toUpperCase() + userInfo.data.role.slice(1)} 
                                  />
                                  {/* <InfoBlock 
                                    icon={User} 
                                    label="User ID" 
                                    value={userInfo.data.userId.substring(0, 8) + '...'} 
                                  /> */}
                                  <InfoBlock 
                                    icon={Calendar} 
                                    label="Joined" 
                                    value={formatDate(userInfo.data.createdAt)} 
                                  />
                                  <InfoBlock 
                                    icon={Clock} 
                                    label="Last Updated" 
                                    value={formatLastUpdated(userInfo.data.updatedAt)} 
                                  />
                                </div>
                                
                                {/* Full Name Display */}
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700">Full Name:</span>
                                  </div>
                                  <span className="text-sm text-slate-900 font-medium">
                                    {userInfo.data.firstName} {userInfo.data.lastName}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 text-sm text-slate-500 italic">
                                No additional user information found.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}