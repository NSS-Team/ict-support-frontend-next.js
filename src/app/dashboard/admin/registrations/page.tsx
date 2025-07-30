'use client';

import { useState, useMemo } from 'react';
import { Search, Calendar, Users, Mail, Building, UserCheck, UserX, Eye, Clock, ChevronDown } from 'lucide-react';
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


    // --------api calls------------

    // Fetch only pending registrations
    const { data: pendingUsersResponse, isLoading: isLoadingPending } = api.adminDash.getUnapprovedRegistrations.useQuery();
    const pendingUsers = pendingUsersResponse?.data || [] as SupportStaffMember[];

    // API mutations for approve/reject
    const approveMutation = api.adminDash.approveUser.useMutation({
        onSuccess: () => {
            // Refetch pending users after approval
            addToast("User approved successfully", "success");
            pendingUsersResponse.refetch();
            closeModal();
        },
        onError: (error) => {
            addToast("Error approving user", "error");
            console.error('Error approving user:', error);
        }
    });

    const rejectMutation = api.adminDash.rejectUser.useMutation({
        onSuccess: () => {
            // Refetch pending users after rejection
            addToast("User rejected successfully", "success");
            pendingUsersResponse.refetch();
            closeModal();
        },
        onError: (error) => {
            addToast("Error rejecting user", "error");
            console.error('Error rejecting user:', error);
        }
    });



    const filteredUsers = useMemo(() => {
        // Add safety check to ensure pendingUsers is an array
        if (!Array.isArray(pendingUsers)) {
            return [];
        }
        return pendingUsers.filter((user: SupportStaffMember) => {
            const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            //   const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;

            return matchesSearch;
        });
    }, [searchTerm, pendingUsers]);

    // Auth checks
    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader />
                <p className="text-gray-500 pl-5">Please wait, while we authorize you...</p>
            </div>
        );
    }

    if (isLoaded && !isSignedIn) {
        return <LoginRequired />;
    }

    if (user?.publicMetadata?.role !== 'admin') {
        return <Unauthorized />;
    }

    // Loading state for data
    if (isLoadingPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader />
                <p className="text-gray-500 pl-5">Loading pending registrations...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Registrations</h1>
                            <p className="text-gray-600">Review and approve new user registration requests</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-2 flex">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <div className="w-4 h-4 flex flex-col gap-0.5">
                                        <div className="h-0.5 bg-current rounded-full"></div>
                                        <div className="h-0.5 bg-current    rounded-full"></div>
                                        <div className="h-0.5 bg-current rounded-full"></div>
                                        <div className="h-0.5 bg-current rounded-full"></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards - Only 2 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl">
                        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Registrations</p>
                                    {/* <p className="text-3xl font-bold text-gray-900">{totalRegistrations}</p> */}
                        {/* <p className="text-xs text-gray-500 mt-1">All time</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div> */}

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Pending Approval</p>
                                    <p className="text-3xl font-bold text-amber-600">{pendingUsers.length}</p>
                                    <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Department Filter */}
                            {/* <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div> */}
                        </div>
                    </div>
                </div>

                {/* Rest of your component remains the same - just replace dummyPendingUsers with pendingUsers */}

                {/* User Cards/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredUsers.map((user: SupportStaffMember) => (
                            <div
                                key={user.id}
                                onClick={() => openModal(user)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 group"
                            >
                                {/* Card content remains the same */}
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                                        {getInitials(user.firstName + ' ' + user.lastName)}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{user.firstName}</p>
                                        <p className="text-sm text-gray-500">{user.role}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 mr-2" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Building className="w-4 h-4 mr-2" />
                                        {user.department}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">
                                        Pending Review
                                    </span>
                                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // List view implementation
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Department</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Registration Date</th>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user: SupportStaffMember) => (
                                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                                        {getInitials(user.firstName + ' ' + user.lastName)}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-700">{user.department}</td>
                                            <td className="py-4 px-6 text-gray-700">{user.role}</td>
                                            <td className="py-4 px-6 text-gray-700">{formatDate(user.createdAt)}</td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => openModal(user)}
                                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                                                >
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending registrations</h3>
                        <p className="text-gray-500">
                            {searchTerm !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'All registration requests have been processed'
                            }
                        </p>
                    </div>
                )}

                {/* Modal remains the same but with real mutations */}
                {/* Modal with content */}
                {isModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-white">Review Registration</h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-white/80 hover:text-white transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                                        {getInitials(selectedUser.firstName + ' ' + selectedUser.lastName)}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {selectedUser.firstName} {selectedUser.lastName}
                                        </h3>
                                        <p className="text-gray-600">{selectedUser.role}</p>
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border mt-2 bg-amber-50 text-amber-700 border-amber-200">
                                            Pending Review
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-gray-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Email</p>
                                                <p className="text-gray-900">{selectedUser.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <Building className="w-5 h-5 text-gray-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Department</p>
                                                <p className="text-gray-900">{selectedUser.department}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <Users className="w-5 h-5 text-gray-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Role</p>
                                                <p className="text-gray-900">{selectedUser.role}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <Users className="w-5 h-5 text-gray-500 mr-3" />
                                            {/* <div>
                                                <p className="text-sm font-medium text-gray-700">Employee ID</p>
                                                <p className="text-gray-900">{selectedUser.employeeId}</p>
                                            </div> */}
                                        </div>

                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Registration Date</p>
                                                <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                                            </div>
                                        </div>

                                        {selectedUser.phone && (
                                            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Phone</p>
                                                    <p className="text-gray-900">{selectedUser.phone}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Details Section */}
                                {/* {(selectedUser.department) && (
                                    <div className="mb-8">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedUser.department && (
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Department</p>
                                                    <p className="text-gray-900">{selectedUser.department}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )} */}

                                {/* Action Buttons with loading states */}
                                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => handleReject(selectedUser.id)}
                                        disabled={rejectMutation.isPending}
                                        className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <UserX className="w-4 h-4" />
                                        {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                                    </button>
                                    <button
                                        onClick={() => handleApprove(selectedUser.id)}
                                        disabled={approveMutation.isPending}
                                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
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
        </div>
    );
}