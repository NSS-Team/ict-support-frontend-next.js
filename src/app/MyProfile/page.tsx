'use client';
import { useState } from 'react';
import { api } from '~/trpc/react';
import {
  User, Mail, Phone, Calendar, Badge, Clock,
  Shield, Building, AlertCircle, Edit3, Settings,
  MapPin, Briefcase, Award, Globe, CheckCircle2,
  XCircle, Timer, Hash, Users, ArrowLeft
} from 'lucide-react';
import {useUser} from '@clerk/nextjs';
import Unauthorized from '../_components/unauthorized/unauthorized';

// User info type based on API response
// interface UserInfo {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   picUrl: string;
//   officeNumber: string | null;
//   department: string | null;
//   designation: string | null;
//   phone: string;
//   locationId: number | null;
//   role: "employee" | "manager" | "admin" | "worker";
//   is_approved: 0 | 1 | 2; // 0: pending, 1: approved, 2: declined
//   codesGenerated: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

export default function MyProfilePage() {
  // Get current user ID (you might get this from auth context or session)
  // const [currentUserId] = useState<string>('current-user-id'); // Replace with actual current user ID
  const { isLoaded, isSignedIn, user } = useUser();
  const userRole = user?.publicMetadata.role || 'employee'; // Default to 'user' if role is not set

  const { data: userInfo, isLoading, isError, refetch } = api.users.getMyInfo.useQuery(undefined, {
    enabled: !!user
  });

  // 
  if (!isSignedIn) {
    return (
      <Unauthorized />
    );
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      manager: 'bg-blue-50 text-blue-700 border-blue-200',
      employee: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      worker: 'bg-amber-50 text-amber-700 border-amber-200'
    };
    return colors[role as keyof typeof colors] || colors.employee;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'manager':
        return <Building className="w-4 h-4" />;
      case 'employee':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // const getApprovalStatus = (status: 0 | 1 | 2) => {
  //   switch (status) {
  //     case 1:
  //       return {
  //         label: 'Approved',
  //         color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  //         icon: <CheckCircle2 className="w-4 h-4" />
  //       };
  //     case 2:
  //       return {
  //         label: 'Declined',
  //         color: 'bg-red-50 text-red-700 border-red-200',
  //         icon: <XCircle className="w-4 h-4" />
  //       };
  //     default:
  //       return {
  //         label: 'Pending',
  //         color: 'bg-amber-50 text-amber-700 border-amber-200',
  //         icon: <Timer className="w-4 h-4" />
  //       };
  //   }
  // };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName && firstName.length > 0 ? firstName[0] : '';
    const last = lastName && lastName.length > 0 ? lastName[0] : '';
    return (`${first ?? ''}${last ?? ''}`).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const updated = new Date(date);
    const diffInHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return formatDate(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !userInfo?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Profile</h3>
            <p className="text-gray-600 mb-6">We encountered an issue while loading your profile information.</p>
            <button 
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  

  const userData = userInfo.data;


  return (

    

    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                  <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
                </div>
              </div>
              {/* <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  {userData.picUrl ? (
                    <img
                      src={userData.picUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                              <span class="text-2xl font-bold text-gray-600">${getInitials(userData.firstName, userData.lastName)}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">{getInitials(userData.firstName, userData.lastName)}</span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {`${userData.firstName} ${userData.lastName}`}
                </h2>
                {userData.designation && (
                  <p className="text-gray-600 mb-3">{userData.designation}</p>
                )}

                <div className="flex flex-col gap-2 mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getRoleColor(userData.role)}`}>
                    {getRoleIcon(userData.role)}
                    <span>{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</span>
                  </div>
                  {/* <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getApprovalStatus(userData.is_approved).color}`}>
                    {getApprovalStatus(userData.is_approved).icon}
                    <span>{getApprovalStatus(userData.is_approved).label}</span>
                  </div> */}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{userData.phone}</span>
                  </div>
                  {userData.department && (
                    <div className="flex items-center justify-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{userData.department}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-600" />
                  Account Overview
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold text-gray-900">{formatDate(userData.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-semibold text-gray-900">{formatLastUpdated(userData.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-2">
                {/* <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Edit3 className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Edit Profile</span>
                </button> */}
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Security Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Privacy Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-gray-600" />
                  Personal Information
                </h3>
                <p className="text-gray-600 mt-1">Your current personal information and contact details</p>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">{userData.firstName}</span>
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">{userData.lastName}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">{userData.email}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">{userData.phone || 'Not provided'}</span>
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Building className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">{userData.department || 'Not assigned'}</span>
                    </div>
                  </div>

                  {/* Designation */}

                  {userRole !== 'manager' && userRole !== 'worker' && <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Job Title
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">{userData.designation || 'Not specified'}</span>
                    </div>
                  </div>}

                  {/* Office Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Office Number
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">{userData.officeNumber || 'Not assigned'}</span>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role & Status
                    </label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(userData.role)}
                        <span className="text-gray-900 font-medium">{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(userData.role)}`}>
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}