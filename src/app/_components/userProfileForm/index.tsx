'use client';

import { useState } from 'react';
import RegularUserForm from './EmployeeForm';
import SupportTeamForm from './SupportTeamForm';
import type { User } from '~/types/user';
import { supportStaffRolesEnum, type supportStaffRoles } from '~/types/enums';
import type { SupportStaffMember } from '~/types/user/supportStaffMemberSchema';
import type { NustEmployee } from '~/types/user/nustEmployeeSchema';

interface Props {
  initialUser: SupportStaffMember | NustEmployee;
  supportRoles: supportStaffRoles
  onSubmit: (data: Partial<User>) => void;
}

const UserProfileForm = ({ initialUser, supportRoles, onSubmit }: Props) => {
  const [isSupportTeam, setIsSupportTeam] = useState(false);

  return (
    <div>
      {isSupportTeam ? (
        <SupportTeamForm initialUser={initialUser as SupportStaffMember} roleOptions = {supportStaffRolesEnum.options} onSubmit={onSubmit} onSwitch={() => setIsSupportTeam(false)} />
      ) : (
        <RegularUserForm
          initialUser={initialUser as NustEmployee}
          onSubmit={onSubmit}
          onSwitch={() => setIsSupportTeam(true)}
        />
      )}
      {/*
      if the result of login check is 
      if the member is from support team then the support tema form will be rendered 
      if the member is not from support team then the regular user form will be rendered
       */}
      
    </div>
  );
};

export default UserProfileForm;
