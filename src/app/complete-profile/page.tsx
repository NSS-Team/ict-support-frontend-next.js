'use client';

import UserInfoForm from '../_components/UserInfo';
import type {User} from '~/types/user';

export default function CompleteProfilePage() {
  const initialUser: User = {
    id: '',
    fullName: '',
    email: '',
    officeNumber: '',
    department: '',
    designation: '',
    phone: '',
    locationId: '',
    role: 'employee',
    is_approved: false,
    createdAt: '',
    updatedAt: '',
  };

  const roleOptions: Array<'employee' | 'manager' | 'admin' | 'worker'> = ['worker', 'employee', 'manager', 'admin'];

  const handleSubmit = (formData: Partial<User>) => {
    console.log('Form submitted:', formData);
    // TODO: send to API
  };

  return (
    <div className="main bg-white h-[calc(100vh-4rem)] flex items-center justify-center">
    <UserInfoForm
      initialUser={initialUser}
      onSubmit={handleSubmit}
      roleOptions={roleOptions}
    />
    </div>
  );
}
