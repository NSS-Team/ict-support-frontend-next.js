'use client';

import { useState, useMemo } from 'react';
import { Search, Calendar, Users, Mail, Building, UserCheck, UserX, Eye, Clock, Grid, List, ArrowLeft, Filter, MoreVertical } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { api } from '~/trpc/react';
import Loader from "~/app/_components/Loader";
import LoginRequired from "~/app/_components/unauthorized/loginToContinue";
import Unauthorized from "~/app/_components/unauthorized/unauthorized";
import type { SupportStaffMember } from '~/types/user/supportStaffMemberSchema';
import { useToast } from '~/app/_components/ToastProvider';

export default function NewRegistrationsPage() {
    const { addToast } = useToast();
    const { user, isLoaded, isSignedIn } = useUser();

    const [selectedUser, setSelectedUser] = useState<SupportStaffMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // API calls
    const { data: pendingUsersResponse, isLoading: isLoadingPending, refetch } = api.adminDash.getUnapprovedRegistrations.useQuery();
    const pendingUsers: SupportStaffMember[] = pendingUsersResponse?.data?.unapprovedUsers || [];

    // API mutations
    const approveMutation = api.adminDash.approveUser.useMutation({
        onSuccess: () => {
            addToast("User approved successfully", "success");
            refetch();
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
            refetch();
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
        return pendingUsers.filter((user: SupportStaffMember) => {
            const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [searchTerm, pendingUsers]);

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

    const openModal = (user: SupportStaffMember) => {
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

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Mobile Header - Sticky */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="px-4 sm:px-6 py-4">
                    {/* Title and View Toggle */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Pending Registrations</h1>
                                <p className="text-sm text-gray-500 hidden sm:block">Review and approve new user requests</p>
                            </div>
                        </div>

                        {/* View Mode Toggle - Mobile Optimized */}
                        <div className="flex items-center gap-2">
                            <div className="bg-gray-100 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-white shadow-sm text-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-white shadow-sm text-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card - Mobile Optimized */}
                    <div className="mb-4">
                        {/* <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-700 text-sm font-medium">Pending Approval</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-amber-600">{pendingUsers.length}</p>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-xl">
                                    <Clock className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* Search Bar - Mobile Optimized */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
                {/* User Cards/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredUsers.map((user: SupportStaffMember) => (
                            <div
                                key={user.id}
                                onClick={() => openModal(user)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 group active:scale-95"
                            >
                                {/* User Info */}
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {user.picUrl ? (
                                            <img
                                                src={user.picUrl}
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
                                        <div className={`w-full h-full flex items-center justify-center ${user.picUrl ? 'hidden' : 'flex'}`}>
                                            {getInitials(user.firstName + ' ' + user.lastName)}
                                        </div>
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{user.role}</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{user.department}</span>
                                    </div>
                                </div>

                                {/* Status and Action */}
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                        Pending Review
                                    </span>
                                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* List View - Mobile Optimized */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Mobile List Items */}
                        <div className="divide-y divide-gray-100">
                            {filteredUsers.map((user: SupportStaffMember) => (
                                <div
                                    key={user.id}
                                    onClick={() => openModal(user)}
                                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                            {user.picUrl ? (
                                                <img
                                                    src={user.picUrl}
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
                                            <div className={`w-full h-full flex items-center justify-center ${user.picUrl ? 'hidden' : 'flex'}`}>
                                                {getInitials(user.firstName + ' ' + user.lastName)}
                                            </div>
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {user.firstName} {user.lastName}
                                                </h3>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 ml-2">
                                                    Pending
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-xs text-gray-500">{user.department}</span>
                                                <span className="text-xs text-gray-500">{user.role}</span>
                                                <span className="text-xs text-gray-500">{formatDate(user.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending registrations</h3>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto">
                            {searchTerm
                                ? 'Try adjusting your search criteria'
                                : 'All registration requests have been processed'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Mobile-Optimized Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
                        {/* Modal Header - Mobile Optimized */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4">
                            {/* Mobile Handle */}
                            <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-3 sm:hidden" />
                            
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg sm:text-xl font-semibold text-white">Review Registration</h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-180px)]">
                            {/* User Header */}
                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {selectedUser.picUrl ? (
                                        <img
                                            src={selectedUser.picUrl}
                                            alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                            className="w-full h-full object-cover rounded-2xl"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                if (e.currentTarget.nextElementSibling) {
                                                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full flex items-center justify-center rounded-2xl ${selectedUser.picUrl ? 'hidden' : 'flex'}`}>
                                        {getInitials(selectedUser.firstName + ' ' + selectedUser.lastName)}
                                    </div>
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <h3 className="text-xl font-semibold text-gray-900 truncate">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h3>
                                    <p className="text-gray-600 truncate">{selectedUser.role}</p>
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border mt-2 bg-amber-50 text-amber-700 border-amber-200">
                                        Pending Review
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid - Mobile Optimized */}
                            <div className="space-y-4 mb-8">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center mb-2">
                                        <Mail className="w-5 h-5 text-gray-500 mr-3" />
                                        <p className="text-sm font-medium text-gray-700">Email Address</p>
                                    </div>
                                    <p className="text-gray-900 break-all">{selectedUser.email}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center mb-2">
                                            <Building className="w-5 h-5 text-gray-500 mr-3" />
                                            <p className="text-sm font-medium text-gray-700">Department</p>
                                        </div>
                                        <p className="text-gray-900">{selectedUser.department}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center mb-2">
                                            <Users className="w-5 h-5 text-gray-500 mr-3" />
                                            <p className="text-sm font-medium text-gray-700">Role</p>
                                        </div>
                                        <p className="text-gray-900">{selectedUser.role}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center mb-2">
                                        <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                                        <p className="text-sm font-medium text-gray-700">Registration Date</p>
                                    </div>
                                    <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                                </div>

                                {selectedUser.phone && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center mb-2">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-700">Phone Number</p>
                                        </div>
                                        <p className="text-gray-900">{selectedUser.phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons - Sticky Bottom */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => handleReject(selectedUser.id)}
                                    disabled={rejectMutation.isPending}
                                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                                >
                                    <UserX className="w-4 h-4" />
                                    {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedUser.id)}
                                    disabled={approveMutation.isPending}
                                    className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                                >
                                    <UserCheck className="w-4 h-4" />
                                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}