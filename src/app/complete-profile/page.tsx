'use client';

import { useState } from 'react';
import RegularUserForm from '../_components/userProfileForm/EmployeeForm';
import SupportTeamForm from '../_components/userProfileForm/SupportTeamForm';

import type { SupportStaffMember } from '~/types/user/supportStaffMemberSchema';
import type { NustEmployee } from '~/types/user/nustEmployeeSchema';
import { supportStaffRolesEnum, type supportStaffRoles } from '~/types/enums';
import type { User } from '~/types/user';

// If you're not using props, you don't need Props interface
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
  role: 'worker', // or any valid default role
  team: '',
};


const UserProfileForm = () => {
  const [userType, setUserType] = useState<'employee' | 'support'>('employee');

  const handleSubmit = (data: Partial<User>) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className='grid h-screen place-items-center'>

      {/* Dynamic Form Rendering */}
      {userType === 'support' ? (
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
      )}
    </div>
  );
};

export default UserProfileForm;
