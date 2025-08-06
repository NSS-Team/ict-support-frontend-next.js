'use client';

import { useState, useEffect } from 'react';
import RegularUserForm from '../_components/userProfileForm/EmployeeForm';
import SupportTeamForm from '../_components/userProfileForm/SupportTeamForm';
import WaitingForApproval from '../_components/userProfileForm/waitingForApproval';

import type { SupportStaffMember } from '~/types/user/supportStaffMemberSchema';
import type { NustEmployee } from '~/types/user/nustEmployeeSchema';
import { supportStaffRolesEnum } from '~/types/enums';
import { useUserStatus } from '~/store/loginCheck';
import { User, Shield, Clock, CheckCircle } from 'lucide-react';
import Loader from '../_components/Loader';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';

const defaultNustEmployee: NustEmployee = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  is_approved: false,
  createdAt: '',
  updatedAt: '',
  locationId: '',
  role: '',
  officeNumber: '',
  department: '',
  designation: '',
};

const defaultSupportStaff: SupportStaffMember = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  is_approved: false,
  createdAt: '',
  updatedAt: '',
  department: '',
  role: 'worker',
  teamId: '',
};

const UserProfileForm = () => {
  const router = useRouter();
  const { exist, approved, hydrated } = useUserStatus();
  const [userType, setUserType] = useState<'employee' | 'support'>('employee');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = api.auth.loginCheck.useQuery(undefined);
  const responseData = data?.data;
  // Handle navigation based on loginCheck data
  useEffect(() => {
    
    if (data?.success) {
      const role = responseData?.role;
      if (responseData) {
        // if exists and not approved, redirect to complete profile
        if (!responseData.exist) {
          
          router.push('/complete-profile');
        } else if (!responseData.approved) {
          router.push('/complete-profile');
          
        }
        else if (responseData.approved) {
          // Redirect based on role
          if (role === 'admin') {
            router.push('/dashboard/admin');
          }
          else if (role === 'manager') {
            router.push('/dashboard/manager');
          }
          else if (role === 'employee') {
            router.push('/dashboard/employee');
          }
          else if (role === 'worker') {
            router.push('/dashboard/worker');
          } 
          else {
            console.error('Unknown role:', role);
            // Optionally handle unknown roles
          }
        }
      }
    }
  }, [data, responseData, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading || !hydrated || !mounted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Loader />
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">Loading Portal</h3>
          <p className="text-neutral-600">Please wait while we prepare your experience...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: Partial<SupportStaffMember | NustEmployee>) => {
    console.log('Form submitted:', data);
  };

  const handleUserTypeSwitch = (newType: 'employee' | 'support') => {
    if (newType === userType) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setUserType(newType);
      setIsTransitioning(false);
    }, 150);
  };

  if (!hydrated || !mounted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Loader />
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">Loading Portal</h3>
          <p className="text-neutral-600">Please wait while we prepare your experience...</p>
        </div>
      </div>
    );
  }

  const getCurrentState = () => {
    if (!exist) return 'registration';
    if (exist && !approved) return 'waiting';
    if (exist && approved) return 'approved';
    return 'registration';
  };

  const currentState = getCurrentState();

  if (currentState === 'waiting') {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold text-gray-700">Profile Under Review</span>
            </div>
          </div>
          <WaitingForApproval />
        </div>
      </div>
    );
  }

  if (currentState === 'approved') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">Welcome to NUST Portal!</h1>
            <p className="text-gray-600 text-lg mb-6">
              Your profile has been approved and you&apos;re all set to use the platform.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Profile Approved</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-full shadow">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Profile Setup</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 mt-4">Welcome to NUST Portal</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Complete your profile to get started. Choose the option that best describes your role.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-white p-2 rounded-xl shadow border border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUserTypeSwitch('employee')}
                disabled={isTransitioning}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 min-w-[160px] justify-center ${userType === 'employee' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'} ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <User className="w-4 h-4" />
                <span>Regular User</span>
              </button>
              <button
                onClick={() => handleUserTypeSwitch('support')}
                disabled={isTransitioning}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 min-w-[160px] justify-center ${userType === 'support' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'} ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Shield className="w-4 h-4" />
                <span>Support Team</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`max-w-5xl mx-auto transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {userType === 'support' ? (
            <SupportTeamForm
              initialUser={defaultSupportStaff}
              roleOptions={supportStaffRolesEnum.options}
              onSubmit={handleSubmit}
              onSwitch={() => handleUserTypeSwitch('employee')}
            />
          ) : (
            <RegularUserForm
              initialUser={defaultNustEmployee}
              onSubmit={handleSubmit}
              onSwitch={() => handleUserTypeSwitch('support')}
            />
          )}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure registration powered by NUST ICT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
