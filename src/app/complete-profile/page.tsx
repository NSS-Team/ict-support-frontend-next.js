'use client';

import UserInfoForm from '../_components/UserInfo';
import type User from '~/types/user';

export default function CompleteProfilePage() {
  const initialUser: Partial<User> = {
    fullName: '',
    phone: '',
    locationId: '',
    department: '',
    officeNumber: '',
    designation: '',
    role: '',
  };

  const roleOptions = ['worker', 'employee', 'manager', 'admin'];
  const departmentOptions = ['mazdoor', 'engineering', 'hr', 'sales'];
  const designationOptions = ['dev', 'qa', 'support'];
  const locationOptions = ['1', '2', '3', '4'];

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
      departmentOptions={departmentOptions}
      designationOptions={designationOptions}
      locationOptions={locationOptions}
    />
    </div>
  );
}
