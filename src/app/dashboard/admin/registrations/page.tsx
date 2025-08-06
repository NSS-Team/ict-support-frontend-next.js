'use client';

import { useState, useMemo } from 'react';
import { Search, Calendar, Users, Mail, Building, Eye, Clock, Grid, List, X, Shield, Wrench, Filter } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { api } from '~/trpc/react';
import Loader from "~/app/_components/Loader";
import LoginRequired from "~/app/_components/unauthorized/loginToContinue";
import Unauthorized from "~/app/_components/unauthorized/unauthorized";
import ViewUser from './viewUser';
import { useToast } from '~/app/_components/ToastProvider';

// Updated interface to match API response
interface PendingUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    picUrl?: string | null;
    phone?: string | null;
    role: string;
    department: string;
    officeNumber?: string | null;
    designation?: string | null;
    location: string;
    createdAt: string;
    teamManager?: string | null;
    teamWorker?: string | null;
}

type DateFilter = 'newest' | 'oldest';
type RoleFilter = 'all' | 'employee' | 'support_staff' | 'manager' | 'worker';

export default function NewRegistrationsPage() {
    const { addToast } = useToast();
    const { user, isLoaded, isSignedIn } = useUser();

    const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Filter states
    const [dateFilter, setDateFilter] = useState<DateFilter>('newest');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

    // API calls
    const { data: pendingUsersResponse, isLoading: isLoadingPending, refetch } = api.adminDash.getUnapprovedRegistrations.useQuery();
    
        // Memoize pendingUsers to prevent dependency changes
    const pendingUsers: PendingUser[] = useMemo(() => {
        return pendingUsersResponse?.data?.unapprovedUsers ?? [];
    }, [pendingUsersResponse?.data?.unapprovedUsers]);

    // API mutations
    const approveMutation = api.adminDash.approveUser.useMutation({
        onSuccess: () => {
            addToast("User approved successfully", "success");
            void refetch().catch((error) => {
                console.error('Error refetching data after approval:', error);
            });
            closeModal();
        },
        onError: (error) => {
            addToast("Error approving user", "error");
            console.error('Error approving user:', error);
        }
    });

    const rejectMutation = api.adminDash.rejectUser.useMutation({
        onSuccess: () => {
            addToast("User rejected successfully", "success");
            void refetch().catch((error) => {
                console.error('Error refetching data after rejection:', error);
            });
            closeModal();
        },
        onError: (error) => {
            addToast("Error rejecting user", "error");
            console.error('Error rejecting user:', error);
        }
    });

    const filteredUsers = useMemo(() => {
        if (!Array.isArray(pendingUsers)) {
            return [];
        }
        
        const filtered = pendingUsers.filter((user: PendingUser) => {
            const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.department.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Updated role filter logic
            let matchesRole = false;
            const userRole = user.role.toLowerCase();
            
            switch (roleFilter) {
                case 'all':
                    matchesRole = true;
                    break;
                case 'employee':
                    matchesRole = userRole === 'employee';
                    break;
                case 'support_staff':
                    matchesRole = userRole === 'manager' || userRole === 'worker';
                    break;
                case 'manager':
                    matchesRole = userRole === 'manager';
                    break;
                case 'worker':
                    matchesRole = userRole === 'worker';
                    break;
                default:
                    matchesRole = true;
            }
            
            return matchesSearch && matchesRole;
        });

        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            
            if (dateFilter === 'newest') {
                return dateB - dateA;
            } else {
                return dateA - dateB;
            }
        });

        return filtered;
    }, [searchTerm, pendingUsers, dateFilter, roleFilter]);

    const filterCounts = useMemo(() => {
        if (!Array.isArray(pendingUsers)) {
            return { all: 0, employee: 0, support_staff: 0, manager: 0, worker: 0 };
        }
        
        const managerCount = pendingUsers.filter(user => user.role.toLowerCase() === 'manager').length;
        const workerCount = pendingUsers.filter(user => user.role.toLowerCase() === 'worker').length;
        
        return {
            all: pendingUsers.length,
            employee: pendingUsers.filter(user => user.role.toLowerCase() === 'employee').length,
            support_staff: managerCount + workerCount,
            manager: managerCount,
            worker: workerCount,
        };
    }, [pendingUsers]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (roleFilter !== 'all') count++;
        if (dateFilter !== 'newest') count++;
        return count;
    }, [dateFilter, roleFilter]);

    // Auth checks
    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <Loader />
                    <p className="text-gray-500 mt-4 text-sm">Please wait, while we authorize you...</p>
                </div>
            </div>
        );
    }

    if (isLoaded && !isSignedIn) {
        return <LoginRequired />;
    }

    if (user?.publicMetadata?.role !== 'admin') {
        return <Unauthorized />;
    }

    if (isLoadingPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <Loader />
                    <p className="text-gray-500 mt-4 text-sm">Loading pending registrations...</p>
                </div>
            </div>
        );
    }

    const openModal = (user: PendingUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleApprove = (id: string) => {
        approveMutation.mutate({ USERID: id });
    };

    const handleReject = (id: string) => {
        rejectMutation.mutate({ USERID: id });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const clearFilters = () => {
        setDateFilter('newest');
        setRoleFilter('all');
        setSearchTerm('');
        setIsFilterOpen(false);
    };

    // Helper function to check if value exists (handles empty strings and nulls)
    const hasValue = (value: string | null | undefined): boolean => {
        return value !== null && value !== undefined && value !== '';
    };

    // Helper function to get role display info
    const getRoleDisplayInfo = (role: string) => {
        switch (role.toLowerCase()) {
            case 'employee':
                return {
                    icon: Building,
                    color: 'bg-blue-500',
                    textColor: 'text-blue-600',
                    bgColor: 'bg-blue-50',
                    label: 'Employee'
                };
            case 'manager':
                return {
                    icon: Shield,
                    color: 'bg-purple-500',
                    textColor: 'text-purple-600',
                    bgColor: 'bg-purple-50',
                    label: 'Manager'
                };
            case 'worker':
                return {
                    icon: Wrench,
                    color: 'bg-green-500',
                    textColor: 'text-green-600',
                    bgColor: 'bg-green-50',
                    label: 'Worker'
                };
            default:
                return {
                    icon: Users,
                    color: 'bg-gray-500',
                    textColor: 'text-gray-600',
                    bgColor: 'bg-gray-50',
                    label: role
                };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Mobile-First Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="px-3 sm:px-4 lg:px-6 py-3">
                    {/* Mobile Title Row */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">Pending Registrations</h1>
                                <p className="text-xs text-gray-500 hidden sm:block">
                                    {filteredUsers.length} of {pendingUsers.length} registrations
                                </p>
                            </div>
                        </div>

                        {/* Mobile Stats & Controls */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Compact Stats */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                                <span className="text-sm sm:text-lg font-bold text-amber-700">{filteredUsers.length}</span>
                                <span className="text-xs text-amber-600 ml-1 hidden sm:inline">pending</span>
                            </div>

                            {/* View Toggle - Hidden on mobile */}
                            <div className="bg-gray-100 rounded-lg p-0.5 hidden sm:flex">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-white shadow-sm text-blue-600' 
                                            : 'text-gray-500'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-white shadow-sm text-blue-600' 
                                            : 'text-gray-500'
                                    }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="sm:hidden p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors relative"
                            >
                                <Filter className="w-4 h-4 text-gray-600" />
                                {activeFilterCount > 0 && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-medium">{activeFilterCount}</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden sm:block">
                        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                            {/* Main Role Filters */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide min-w-0 flex-1">
                                <div className="flex items-center gap-2 min-w-max">
                                    {[
                                        { 
                                            key: 'all' as RoleFilter, 
                                            label: 'All', 
                                            count: filterCounts.all,
                                            icon: Users,
                                            color: 'text-gray-600'
                                        },
                                        { 
                                            key: 'employee' as RoleFilter, 
                                            label: 'Employee', 
                                            count: filterCounts.employee,
                                            icon: Building,
                                            color: 'text-blue-600'
                                        },
                                        { 
                                            key: 'support_staff' as RoleFilter, 
                                            label: 'Support Staff', 
                                            count: filterCounts.support_staff,
                                            icon: Shield,
                                            color: 'text-purple-600'
                                        },
                                    ].map((role) => (
                                        <button
                                            key={role.key}
                                            onClick={() => setRoleFilter(role.key)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                                                roleFilter === role.key
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <role.icon className="w-3 h-3" />
                                            <span>{role.label}</span>
                                            <span className={`px-1.5 py-0.5 rounded-full text-xs flex-shrink-0 ${
                                                roleFilter === role.key
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {role.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Secondary Filters */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide min-w-0 xl:flex-shrink-0">
                                <div className="flex items-center gap-2 min-w-max">
                                    {/* Sub-filters for Support Staff */}
                                    {roleFilter === 'support_staff' && (
                                        <>
                                            <div className="hidden xl:block w-px h-6 bg-gray-300 mx-1"></div>
                                            <span className="text-xs text-gray-500 font-medium px-2 py-1 xl:hidden">Refine:</span>
                                            {[
                                                { 
                                                    key: 'manager' as RoleFilter, 
                                                    label: 'Managers', 
                                                    count: filterCounts.manager,
                                                    icon: Shield,
                                                    color: 'text-purple-600'
                                                },
                                                { 
                                                    key: 'worker' as RoleFilter, 
                                                    label: 'Workers', 
                                                    count: filterCounts.worker,
                                                    icon: Wrench,
                                                    color: 'text-green-600'
                                                },
                                            ].map((subRole) => (
                                                <button
                                                    key={subRole.key}
                                                    onClick={() => setRoleFilter(subRole.key)}
                                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                                                        roleFilter === subRole.key
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                                                    }`}
                                                >
                                                    <subRole.icon className="w-3 h-3" />
                                                    <span>{subRole.label}</span>
                                                    <span className={`px-1.5 py-0.5 rounded-full text-xs flex-shrink-0 ${
                                                        roleFilter === subRole.key
                                                            ? 'bg-purple-500 text-white'
                                                            : 'bg-purple-200 text-purple-700'
                                                    }`}>
                                                        {subRole.count}
                                                    </span>
                                                </button>
                                            ))}
                                        </>
                                    )}

                                    {/* Date Sort Toggle */}
                                    <button
                                        onClick={() => setDateFilter(dateFilter === 'newest' ? 'oldest' : 'newest')}
                                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                                            dateFilter !== 'newest'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                        <span className="hidden md:inline">{dateFilter === 'newest' ? 'Newest' : 'Oldest'}</span>
                                        <span className="md:hidden">{dateFilter === 'newest' ? 'New' : 'Old'}</span>
                                        {dateFilter === 'newest' ? (
                                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Clear Filters */}
                                    {(activeFilterCount > 0 || searchTerm) && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-1 px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0"
                                        >
                                            <X className="w-3 h-3 flex-shrink-0" />
                                            <span className="hidden md:inline">Clear</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filter Panel */}
                    {isFilterOpen && (
                        <div className="sm:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-lg z-50">
                            <div className="p-4 space-y-4">
                                {/* Role Filters */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Role</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { key: 'all' as RoleFilter, label: 'All', count: filterCounts.all, icon: Users },
                                            { key: 'employee' as RoleFilter, label: 'Employee', count: filterCounts.employee, icon: Building },
                                            { key: 'support_staff' as RoleFilter, label: 'Support Staff', count: filterCounts.support_staff, icon: Shield },
                                        ].map((role) => (
                                            <button
                                                key={role.key}
                                                onClick={() => setRoleFilter(role.key)}
                                                className={`flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${
                                                    roleFilter === role.key
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <role.icon className="w-4 h-4" />
                                                    <span>{role.label}</span>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                    roleFilter === role.key
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    {role.count}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sub-filters for Support Staff */}
                                    {roleFilter === 'support_staff' && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <h4 className="text-xs font-medium text-gray-500 mb-2">Refine Support Staff</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { key: 'manager' as RoleFilter, label: 'Managers', count: filterCounts.manager, icon: Shield },
                                                    { key: 'worker' as RoleFilter, label: 'Workers', count: filterCounts.worker, icon: Wrench },
                                                ].map((subRole) => (
                                                    <button
                                                        key={subRole.key}
                                                        onClick={() => setRoleFilter(subRole.key)}
                                                        className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                            roleFilter === subRole.key
                                                                ? 'bg-purple-600 text-white'
                                                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <subRole.icon className="w-4 h-4" />
                                                            <span>{subRole.label}</span>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                            roleFilter === subRole.key
                                                                ? 'bg-purple-500 text-white'
                                                                : 'bg-purple-200 text-purple-700'
                                                        }`}>
                                                            {subRole.count}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sort Options */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Sort by Date</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setDateFilter('newest')}
                                            className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                                                dateFilter === 'newest'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <Calendar className="w-4 h-4" />
                                            <span>Newest</span>
                                        </button>
                                        <button
                                            onClick={() => setDateFilter('oldest')}
                                            className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                                                dateFilter === 'oldest'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            <Calendar className="w-4 h-4" />
                                            <span>Oldest</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile Filter Actions */}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={clearFilters}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Filters Summary */}
                    {(roleFilter !== 'all' || dateFilter !== 'newest' || searchTerm) && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg mt-3">
                            <span className="font-medium">Active:</span>
                            <div className="flex items-center gap-1 flex-wrap">
                                {roleFilter !== 'all' && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {roleFilter === 'support_staff' ? 'Support Staff' : 
                                         roleFilter === 'employee' ? 'Employee' : 
                                         roleFilter === 'manager' ? 'Managers' : 
                                         roleFilter === 'worker' ? 'Workers' : roleFilter}
                                    </span>
                                )}
                                {dateFilter !== 'newest' && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {dateFilter === 'oldest' ? 'Oldest First' : 'Newest First'}
                                    </span>
                                )}
                                {searchTerm && (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded truncate max-w-24">
                                        &ldquo;{searchTerm}&rdquo;
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content - Mobile Optimized */}
            <div className="px-3 sm:px-4 lg:px-6 py-4 max-w-7xl mx-auto">
                {/* Mobile View Mode Toggle */}
                <div className="sm:hidden mb-4">
                    <div className="bg-gray-100 rounded-lg p-0.5 flex w-full">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex-1 p-2 rounded transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-white shadow-sm text-blue-600' 
                                    : 'text-gray-500'
                            }`}
                        >
                            <List className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex-1 p-2 rounded transition-colors ${
                                viewMode === 'grid' 
                                    ? 'bg-white shadow-sm text-blue-600' 
                                    : 'text-gray-500'
                            }`}
                        >
                            <Grid className="w-4 h-4 mx-auto" />
                        </button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    /* Mobile-Optimized List View */
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {filteredUsers.map((user: PendingUser) => {
                                const roleInfo = getRoleDisplayInfo(user.role);
                                const RoleIcon = roleInfo.icon;
                                
                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => openModal(user)}
                                        className="p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden ${roleInfo.color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                                {hasValue(user.picUrl) ? (
                                                    <img
                                                        src={user.picUrl!}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            if (e.currentTarget.nextElementSibling) {
                                                                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                                            }
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-full h-full flex items-center justify-center ${hasValue(user.picUrl) ? 'hidden' : 'flex'}`}>
                                                    {getInitials(user.firstName + ' ' + user.lastName)}
                                                </div>
                                            </div>

                                            {/* User Info */}
                                            <div className="flex-1 min-w-0">
                                                {/* Name and Status */}
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                                            {user.firstName} {user.lastName}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.textColor} border border-current border-opacity-20`}>
                                                                <RoleIcon className="w-3 h-3" />
                                                                {roleInfo.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
                                                        Pending
                                                    </span>
                                                </div>

                                                {/* Details */}
                                                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                                                    <p className="truncate">{user.email}</p>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className="truncate">{user.department}</span>
                                                        {hasValue(user.location) && (
                                                            <span className="truncate hidden sm:inline">{user.location}</span>
                                                        )}
                                                        <span className="text-gray-500 hidden sm:inline">{formatDate(user.createdAt)}</span>
                                                    </div>
                                                    
                                                    {/* Mobile: Show location and date in separate line */}
                                                    <div className="flex items-center gap-3 sm:hidden text-gray-500">
                                                        {hasValue(user.location) && (
                                                            <span className="truncate">{user.location}</span>
                                                        )}
                                                        <span>{formatDate(user.createdAt)}</span>
                                                    </div>
                                                    
                                                    {/* Team info */}
                                                    {(user.role.toLowerCase() === 'worker' || user.role.toLowerCase() === 'manager') && (hasValue(user.teamManager) || hasValue(user.teamWorker)) && (
                                                        <div className="flex items-center gap-2 flex-wrap mt-2">
                                                            {hasValue(user.teamManager) && (
                                                                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded truncate">
                                                                    Manager: {user.teamManager}
                                                                </span>
                                                            )}
                                                            {hasValue(user.teamWorker) && (
                                                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded truncate">
                                                                    Team: {user.teamWorker}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex-shrink-0 hidden sm:block">
                                                <Eye className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Mobile-Optimized Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {filteredUsers.map((user: PendingUser) => {
                            const roleInfo = getRoleDisplayInfo(user.role);
                            const RoleIcon = roleInfo.icon;
                            
                            return (
                                <div
                                    key={user.id}
                                    onClick={() => openModal(user)}
                                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group active:scale-95"
                                >
                                    {/* Header */}
                                    <div className="flex items-center mb-3">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden ${roleInfo.color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                                            {hasValue(user.picUrl) ? (
                                                <img
                                                    src={user.picUrl!}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        if (e.currentTarget.nextElementSibling) {
                                                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                                        }
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-full h-full flex items-center justify-center ${hasValue(user.picUrl) ? 'hidden' : 'flex'}`}>
                                                {getInitials(user.firstName + ' ' + user.lastName)}
                                            </div>
                                        </div>
                                        <div className="ml-2.5 flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-sm">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <RoleIcon className={`w-3 h-3 ${roleInfo.textColor}`} />
                                                <p className={`text-xs truncate ${roleInfo.textColor} font-medium`}>{roleInfo.label}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center text-xs text-gray-600">
                                            <Mail className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-600">
                                            <Building className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                            <span className="truncate">{user.department}</span>
                                        </div>
                                        {hasValue(user.location) && (
                                            <div className="flex items-center text-xs text-gray-600">
                                                <Calendar className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                                <span className="truncate">{user.location}</span>
                                            </div>
                                        )}
                                        
                                        {/* Team info for support staff */}
                                        {(user.role.toLowerCase() === 'worker' || user.role.toLowerCase() === 'manager') && (
                                            <>
                                                {hasValue(user.teamManager) && (
                                                    <div className="flex items-center text-xs text-purple-600">
                                                        <Shield className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                                        <span className="truncate">Manager: {user.teamManager}</span>
                                                    </div>
                                                )}
                                                {hasValue(user.teamWorker) && (
                                                    <div className="flex items-center text-xs text-green-600">
                                                        <Users className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                                        <span className="truncate">Team: {user.teamWorker}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        
                                        <div className="flex items-center text-xs text-gray-600">
                                            <Calendar className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                            <span className="truncate">{formatDate(user.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                            Pending
                                        </span>
                                        <Eye className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 px-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-base font-medium text-gray-900 mb-1">
                            {searchTerm || roleFilter !== 'all' || dateFilter !== 'newest' 
                                ? 'No matching registrations' 
                                : 'No pending registrations'
                            }
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-3">
                            {searchTerm || roleFilter !== 'all' || dateFilter !== 'newest'
                                ? 'Try adjusting your search criteria or filters'
                                : 'All registration requests have been processed'
                            }
                        </p>
                        {(searchTerm || roleFilter !== 'all' || dateFilter !== 'newest') && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ViewUser Component */}
            {selectedUser && (
                <ViewUser
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isApproving={approveMutation.isPending}
                    isRejecting={rejectMutation.isPending}
                />
            )}

            {/* Styles */}
            <style jsx global>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar { 
                    display: none;
                }
            `}</style>
        </div>
    );
}