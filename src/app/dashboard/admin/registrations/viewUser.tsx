'use client';

import { Mail, Building, Users, Calendar, UserCheck, UserX, X, Phone, MapPin, Clock, Shield, Briefcase, Hash, User, Wrench } from 'lucide-react';
import Image from 'next/image';

interface ViewUserProps {
    user: {
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
    };
    isOpen: boolean;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    isApproving?: boolean;
    isRejecting?: boolean;
}

export default function ViewUser({
    user,
    isOpen,
    onClose,
    onApprove,
    onReject,
    isApproving = false,
    isRejecting = false
}: ViewUserProps) {
    if (!isOpen) return null;

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to check if field has value (handles empty strings)
    const hasValue = (value: string | null | undefined): boolean => {
        return value !== null && value !== undefined && value !== '';
    };

    // Role-based configuration
    const getRoleConfig = (role: string) => {
        switch (role.toLowerCase()) {
            case 'employee':
                return {
                    color: 'blue',
                    icon: User,
                    title: 'Employee',
                    description: 'Standard team member'
                };
            case 'worker':
                return {
                    color: 'green',
                    icon: Wrench,
                    title: 'Worker',
                    description: 'Field operations staff'
                };
            case 'manager':
                return {
                    color: 'purple',
                    icon: Shield,
                    title: 'Manager',
                    description: 'Management personnel'
                };
            default:
                return {
                    color: 'gray',
                    icon: User,
                    title: role,
                    description: 'Team member'
                };
        }
    };

    const roleConfig = getRoleConfig(user.role);
    const RoleIcon = roleConfig.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-2 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden relative border border-gray-200">
                {/* Mobile Handle */}
                <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-3"></div>
                
                {/* Responsive Header */}
                <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`p-1.5 sm:p-2 rounded-lg ${
                                roleConfig.color === 'blue' ? 'bg-blue-50' :
                                roleConfig.color === 'green' ? 'bg-green-50' :
                                roleConfig.color === 'purple' ? 'bg-purple-50' :
                                'bg-gray-50'
                            }`}>
                                <RoleIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                    roleConfig.color === 'blue' ? 'text-blue-600' :
                                    roleConfig.color === 'green' ? 'text-green-600' :
                                    roleConfig.color === 'purple' ? 'text-purple-600' :
                                    'text-gray-600'
                                }`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                    Registration Review
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">
                                    {roleConfig.title} • Pending Approval
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(85vh-140px)] sm:max-h-[calc(80vh-160px)] bg-gray-50">
                    {/* User Profile Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 mb-3 sm:mb-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg ${
                                    roleConfig.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                                    roleConfig.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                                    roleConfig.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                                    'bg-gradient-to-br from-gray-500 to-gray-600'
                                }`}>
                                    {hasValue(user.picUrl) ? (
                                        <Image
                                            src={user.picUrl!}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover rounded-full"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                if (e.currentTarget.nextElementSibling) {
                                                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full flex items-center justify-center rounded-full ${hasValue(user.picUrl) ? 'hidden' : 'flex'}`}>
                                        {getInitials(user.firstName + ' ' + user.lastName)}
                                    </div>
                                </div>
                                {/* Status Badge */}
                                <div className="absolute -bottom-1 -right-1 p-1 bg-amber-100 rounded-full border-2 border-white">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center sm:text-left min-w-0">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <div className="flex flex-col sm:flex-row items-center gap-2 mb-2 sm:mb-3">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
                                        roleConfig.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        roleConfig.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                                        roleConfig.color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                        'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}>
                                        <RoleIcon className="w-4 h-4" />
                                        {roleConfig.title}
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                        <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                                        Pending Review
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Registered on {formatDateTime(user.createdAt)}
                                </p>
                                
                                {/* Show Manager Info for Workers */}
                                {user.role.toLowerCase() === 'worker' && hasValue(user.teamManager) && (
                                    <div className="mt-2 sm:mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                                        <Shield className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-900">
                                            Reports to: {user.teamManager}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Information Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                        {/* Contact Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-2 sm:mb-3">Contact Information</p>
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                                <p className="text-sm font-medium text-gray-900 break-all">{user.email}</p>
                                            </div>
                                        </div>
                                        
                                        {hasValue(user.phone) && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                    {user.role.toLowerCase() === 'worker' ? 'Work Site' : 'Location'}
                                                </p>
                                                <p className="text-sm font-medium text-gray-900">{user.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Work Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
                                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-500 mb-2 sm:mb-3">Work Details</p>
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Building className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                                                <p className="text-sm font-medium text-gray-900">{user.department}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <RoleIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                                                <p className="text-sm font-medium text-gray-900 capitalize">{user.role}</p>
                                            </div>
                                        </div>

                                        {/* Manager Name - Prominently displayed for workers */}
                                        {user.role.toLowerCase() === 'worker' && hasValue(user.teamManager) && (
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">Manager</p>
                                                    <p className="text-sm font-semibold text-blue-900">{user.teamManager}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Team Worker */}
                                        {user.role.toLowerCase() === 'worker' && hasValue(user.teamWorker) && (
                                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                                <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-green-600 uppercase tracking-wide font-medium">Team</p>
                                                    <p className="text-sm font-medium text-green-900">{user.teamWorker}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Conditional fields for non-workers */}
                                        {user.role.toLowerCase() !== 'worker' && hasValue(user.designation) && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Briefcase className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Designation</p>
                                                    <p className="text-sm font-medium text-gray-900">{user.designation}</p>
                                                </div>
                                            </div>
                                        )}

                                        {user.role.toLowerCase() !== 'worker' && hasValue(user.officeNumber) && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Hash className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Office</p>
                                                    <p className="text-sm font-medium text-gray-900">{user.officeNumber}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Registered</p>
                                                <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Review Summary */}
                    {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 sm:p-2 bg-amber-50 rounded-lg">
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Ready for Review</p>
                                    <p className="text-xs text-gray-500">All required information has been provided</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Registration ID</p>
                                <p className="text-sm font-mono text-gray-700">{user.id.slice(-8)}</p>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Action Buttons */}
                <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
                    <div className="flex gap-3">
                        <button
                            onClick={() => onReject(user.id)}
                            disabled={isRejecting || isApproving}
                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-red-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-red-600 font-medium rounded-lg border border-red-300 hover:border-red-400 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <UserX className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {isRejecting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                                        Rejecting...
                                    </span>
                                ) : (
                                    `Reject ${roleConfig.title}`
                                )}
                            </span>
                            <span className="sm:hidden">
                                {isRejecting ? "..." : "Reject"}
                            </span>
                        </button>
                        
                        <button
                            onClick={() => onApprove(user.id)}
                            disabled={isApproving || isRejecting}
                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <UserCheck className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {isApproving ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Approving...
                                    </span>
                                ) : (
                                    `Approve ${roleConfig.title}`
                                )}
                            </span>
                            <span className="sm:hidden">
                                {isApproving ? "..." : "Approve"}
                            </span>
                        </button>
                    </div>
                    
                    {/* <div className="my-2 text-center">
                        <p className="text-xs text-gray-500">
                            Email notification will be sent to {user.email}
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}