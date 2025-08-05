'use client';

import { useState, useEffect } from 'react';
import { api } from '~/trpc/react';
import {
  Users, UserCheck, Mail, Phone, Calendar, MapPin, Badge,
  ChevronDown, ChevronUp, Clock, Building, User, Award, Star,
  TrendingUp, Target, BarChart3
} from 'lucide-react';
import type { TeamWorker } from '~/types/teams/teamWorker';
import { StatCard, InfoBlock, LoadingUI, ErrorUI, EmptyUI } from './reusableCompos';
import { useUser } from '@clerk/nextjs';
import Loader from '../_components/Loader';
import LoginRequired from '../_components/unauthorized/loginToContinue';

export default function MyTeamPage() {

  const { isLoaded, isSignedIn, user } = useUser();
  const userRole = user?.publicMetadata?.role || 'user';
  const MyTeam = user?.publicMetadata?.teamName || 'My Team';
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [workers, setWorkers] = useState<TeamWorker[]>([]);

  const { data: getTeamWorkersResponse, isLoading, isError } = api.teams.myTeam.useQuery();

  const { data: userInfo, isLoading: isUserInfoLoading } = api.users.getUserInfo.useQuery(
    { id: selectedUserId ?? '' },
    {
      enabled: !!selectedUserId,
    }
  );

  useEffect(() => {
    if (getTeamWorkersResponse) {
      setWorkers((getTeamWorkersResponse?.data?.workers || []).filter((w): w is TeamWorker => w !== undefined));
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

  // Professional points styling
  const getPerformanceLevel = (points: number) => {
    if (points >= 100) return {
      level: 'Exceptional',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      barColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
      icon: TrendingUp,
      description: 'Outstanding Performance'
    };
    if (points >= 75) return {
      level: 'Excellent',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      barColor: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      icon: Target,
      description: 'Above Average Performance'
    };
    if (points >= 50) return {
      level: 'Good',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      barColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
      icon: BarChart3,
      description: 'Meeting Expectations'
    };
    if (points >= 25) return {
      level: 'Developing',
      color: 'text-slate-700',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      barColor: 'bg-gradient-to-r from-slate-500 to-slate-600',
      icon: Award,
      description: 'Growing Performance'
    };
    return {
      level: 'Starting',
      color: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      barColor: 'bg-gradient-to-r from-gray-400 to-gray-500',
      icon: User,
      description: 'Beginning Journey'
    };
  };

  const getCompactPointsDisplay = (points: number) => {
    const performance = getPerformanceLevel(points);
    return {
      className: `px-3 py-1.5 text-sm font-semibold rounded-lg ${performance.bgColor} ${performance.color} ${performance.borderColor} border shadow-sm`,
      content: `${points} pts`
    };
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

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  
  // Check if user is logged in
  if (isLoaded && !isSignedIn) {
    return (
      <LoginRequired />
    );
  }

  // Get role statistics
  const roleStats = workers.reduce((acc, worker) => {
    acc.total = workers.length;
    acc.active = workers.filter(w => w.status === 'active').length;
    return acc;
  }, { total: 0, active: 0 });

  // Calculate points statistics
  const pointsStats = workers.reduce((acc, worker) => {
    const points = worker.points || 0;
    acc.totalPoints += points;
    acc.averagePoints = workers.length > 0 ? Math.round(acc.totalPoints / workers.length) : 0;
    acc.highestPoints = Math.max(acc.highestPoints, points);
    return acc;
  }, { totalPoints: 0, averagePoints: 0, highestPoints: 0 });

  return (
    <div className="pb-20 flex-1 bg-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Team</h1>
              <h2 className="text-1xl sm:text-2xl text-gray-500">{String(MyTeam)}</h2>
              {userRole === 'manager' && <p className="text-gray-500 mt-1">Manage and view your team members</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Members"
              value={roleStats.total}
              icon={<Users className="w-8 h-8 text-blue-500" />}
            />
            {userRole === 'manager' && (
              <>
                <StatCard
                  label="Active Members"
                  value={roleStats.active}
                  icon={<UserCheck className="w-8 h-8 text-green-500" />}
                  color="text-green-600"
                />
                <StatCard
                  label="Total Points"
                  value={pointsStats.totalPoints}
                  icon={<Award className="w-8 h-8 text-yellow-500" />}
                  color="text-yellow-600"
                />
                <StatCard
                  label="Avg Points"
                  value={pointsStats.averagePoints}
                  icon={<Star className="w-8 h-8 text-purple-500" />}
                  color="text-purple-600"
                />
              </>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-100 rounded-t-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            {userRole === 'manager' && <p className="text-sm text-gray-500 mt-1">Click on any member to view detailed information</p>}
          </div>

          <div className="p-6">
            {userRole === 'worker' && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 bg-yellow-100 p-3 rounded-lg border border-yellow-300">
                  <h3 className="font-medium text-yellow-800">Manager - </h3>
                  <h3 className="font-medium text-gray-900 truncate">{getTeamWorkersResponse?.data?.manager?.managerName || 'N/A'}</h3>
                </div>
              </div>
            )}
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
                {workers.map(member => {
                  const points = member.points || 0;
                  const performance = getPerformanceLevel(points);
                  const compactDisplay = getCompactPointsDisplay(points);
                  
                  return (
                    <div
                      key={member.workerId}
                      className="group border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-md hover:border-blue-300 overflow-hidden"
                    >
                      {/* Header */}
                      <div
                        onClick={() => {
                          if (userRole === 'manager') {
                            toggleMemberExpansion(member.workerId, member.workerUserId);
                          }
                        }}
                        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-all"
                      >
                        <div className="relative shrink-0">
                          {userInfo?.data?.picUrl && expandedMember === member.workerId ? (
                            <img
                              src={userInfo.data.picUrl}
                              alt={member.workerName}
                              className="w-12 h-12 rounded-xl object-cover"
                              onError={(e) => {
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
                          {userRole === 'manager' && (
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${member.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">{member.workerName}</h3>
                            {userRole === 'manager' && (
                              <>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(member.status)}`}>
                                  {member.status}
                                </span>
                                {/* Professional Points Badge */}
                                <div className={compactDisplay.className}>
                                  {compactDisplay.content}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex gap-4 text-sm text-gray-500">
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

                        <div className="shrink-0 flex items-center gap-2">
                          {/* Worker Points Display - Always Visible */}
                          {userRole !== 'manager' && (
                            <div className={compactDisplay.className}>
                              {compactDisplay.content}
                            </div>
                          )}
                          
                          {userRole === 'manager' && (
                            <>
                              {expandedMember === member.workerId ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Expanded Info */}
                      {expandedMember === member.workerId && userRole === 'manager' && (
                        <div className="border-t border-gray-100 bg-gray-50">
                          {isUserInfoLoading ? (
                            <div className="p-4 text-sm text-gray-500 italic flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                              Loading user information...
                            </div>
                          ) : userInfo?.data ? (
                            <div className="p-4">
                              {/* Professional Performance Section */}
                              <div className={`mb-4 p-6 bg-white rounded-xl border-2 ${performance.borderColor} shadow-sm`}>
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${performance.bgColor}`}>
                                      <performance.icon className={`w-5 h-5 ${performance.color}`} />
                                    </div>
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900">Performance Score</h3>
                                      <p className="text-sm text-gray-600">{performance.description}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-3xl font-bold text-gray-900">{points}</div>
                                    <div className="text-sm text-gray-500">points</div>
                                  </div>
                                </div>

                                {/* Performance Level Badge */}
                                <div className="flex items-center justify-between mb-4">
                                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${performance.bgColor} ${performance.color} ${performance.borderColor} border`}>
                                    {performance.level} Performance
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {Math.round((points / 100) * 100)}% of target
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm text-gray-600">
                                    <span>Progress to Next Level</span>
                                    <span>{points}/100</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-700 ease-out ${performance.barColor} shadow-sm`}
                                      style={{ width: `${Math.min((points / 100) * 100, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
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
                                <InfoBlock
                                  icon={TrendingUp}
                                  label="Performance Level"
                                  value={performance.level}
                                />
                              </div>

                              {/* Full Name Display */}
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">Full Name:</span>
                                </div>
                                <span className="text-sm text-gray-900 font-medium">
                                  {userInfo.data.firstName} {userInfo.data.lastName}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 text-sm text-gray-500 italic">
                              No additional user information found.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}