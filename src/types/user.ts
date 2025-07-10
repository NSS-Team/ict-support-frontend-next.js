export type UserRole = 'employee' | 'manager' | 'admin' | 'worker';

export default interface User {
  id: string;
  fullName: string;
  email: string;
  officeNumber: string;
  department: string;
  designation: string;
  phone: string;
  locationId: string;
  role: UserRole;
  is_approved: boolean;
  createdAt: string;
  updatedAt: string;
}