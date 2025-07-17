'use client';

import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import RegularUserForm from '../_components/userProfileForm/EmployeeForm';
import SupportTeamForm from '../_components/userProfileForm/SupportTeamForm';
import WaitingForApproval from '../_components/userProfileForm/waitingForApproval';

import type { SupportStaffMember } from '~/types/user/supportStaffMemberSchema';
import type { NustEmployee } from '~/types/user/nustEmployeeSchema';
import type { User } from '~/types/user';
import { supportStaffRolesEnum } from '~/types/enums';
import { useUserStatus } from '~/store/loginCheck';
import Loader from '../_components/Loader';
import { hydrate } from '@tanstack/react-query';

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
  const { exist, approved , hydrated} = useUserStatus();

  const [userType, setUserType] = useState<'employee' | 'support'>('employee');

  const handleSubmit = (data: Partial<User>) => {
    console.log('Form submitted:', data);
  };

  // 💡 Decide what to render
  let content = null;
  console.log('Exist:', exist, 'Approved:', approved, 'User Type:', userType);

  if(!hydrated) {
    return (
      <div className="grid h-screen place-items-center">
        <Loader />
      </div>
    );
  }

  if (!exist) {
    content =
      userType === 'support' ? (
        <SupportTeamForm
          initialUser={defaultSupportStaff}
          roleOptions={supportStaffRolesEnum.options}
          onSubmit={handleSubmit}
          onSwitch={() => setUserType('employee')}
        />
      ) : (
        <RegularUserForm
          initialUser={defaultNustEmployee}
          onSubmit={handleSubmit}
          onSwitch={() => setUserType('support')}
        />
      );
  } else if (exist && !approved) {
    content = <WaitingForApproval />;
    console.log('User exists but not approved');
    
  }

  return (
    <div className="grid h-screen place-items-center">
      {content}
    </div>
  );
};

export default UserProfileForm;
