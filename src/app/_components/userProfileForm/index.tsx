'use client';

import { useState } from 'react';
import RegularUserForm from './EmployeeForm';
import SupportTeamForm from './SupportTeamForm';
import { supportStaffRolesEnum, } from '~/types/enums';
import type { SupportStaffMember } from '~/types/user/supportStaffMemberSchema';
import type { NustEmployee } from '~/types/user/nustEmployeeSchema';
import { User, Shield } from 'lucide-react';

interface Props {
  initialUser: SupportStaffMember | NustEmployee;
  onSubmit: (data: Partial<SupportStaffMember | NustEmployee>) => void;
}

const UserProfileForm = ({ initialUser, onSubmit }: Props) => {
  const [isSupportTeam, setIsSupportTeam] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSwitch = (toSupportTeam: boolean) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsSupportTeam(toSupportTeam);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full shadow-lg border border-white/20 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Profile Setup</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Welcome to NUST Portal
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Complete your profile to get started. Choose the option that best describes your role.
          </p>
        </div>

        {/* Role Selection Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSwitch(false)}
                disabled={isTransitioning}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 min-w-[160px] justify-center
                  ${!isSupportTeam 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }
                  ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <User className="w-4 h-4" />
                <span>Regular User</span>
              </button>
              
              <button
                onClick={() => handleSwitch(true)}
                disabled={isTransitioning}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 min-w-[160px] justify-center
                  ${isSupportTeam 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }
                  ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Shield className="w-4 h-4" />
                <span>Support Team</span>
              </button>
            </div>
          </div>
        </div>

        {/* Role Description */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              {isSupportTeam ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Support Team Member</h3>
                    <p className="text-gray-600 mb-3">
                      Join our support team to help users, resolve issues, and maintain the platform. You&apos;ll have access to advanced tools and administrative features.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Admin Access</span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">User Support</span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Issue Resolution</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Regular User</h3>
                    <p className="text-gray-600 mb-3">
                      Standard user account for NUST employees and students. Access all regular platform features and services with your department and location details.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Standard Access</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Platform Features</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Department Services</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {isSupportTeam ? (
            <SupportTeamForm 
              initialUser={initialUser as SupportStaffMember} 
              roleOptions={supportStaffRolesEnum._def.values} 
              onSubmit={onSubmit} 
              onSwitch={() => handleSwitch(false)} 
            />
          ) : (
            <RegularUserForm
              initialUser={initialUser as NustEmployee}
              onSubmit={onSubmit}
              onSwitch={() => handleSwitch(true)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-sm text-gray-600 border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Secure registration powered by NUST ICT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;