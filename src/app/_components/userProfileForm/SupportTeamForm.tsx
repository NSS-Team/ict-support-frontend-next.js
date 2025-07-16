import type { User } from '~/types/user';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { api } from '~/trpc/react';
import { CheckCircle, Clock } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';
import type { supportStaffRoles } from '~/types/enums';
import type { SupportStaffMember } from '~/types/user/supportStaffMemberSchema';
import { supportStaffRolesEnum } from '~/types/enums';

interface Props {
  initialUser: SupportStaffMember;
  roleOptions: supportStaffRoles[];
  onSubmit: (data: Partial<User>) => void;
  onSwitch: () => void;
}

const SupportTeamForm = ({ initialUser,roleOptions, onSubmit, onSwitch }: Props) => {
  const [formData, setFormData] = useState<Partial<SupportStaffMember>>(initialUser);
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? '';
  const { data: locationResponse = [], isLoading: isLocationsLoading } = api.locations.getLocations.useQuery();
  const locationOptions = Array.isArray(locationResponse) ? [] : locationResponse?.data ?? [];
  const { mutate: completeProfileStaff, isPending: isSubmitting } = api.auth.completeProfileStaff.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: () => alert('Something went wrong!'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };


  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    (['firstName', 'lastName', 'phone', 'locationId', 'role'] as (keyof SupportStaffMember)[]).forEach((field) => {
      if (!formData[field]) newErrors[field as string] = `${field} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.role || !email) {
      return alert('Missing fields');
    }
    completeProfileStaff({
      email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: formData.role,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {!submitted && step === 1 && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Support Team Signup</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleChange} error={errors.firstName} />
            <InputField label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleChange} error={errors.lastName} />
            <InputField label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} error={errors.phone} />
            <SelectField label="Role" name="role" options={supportStaffRolesEnum.options.map(r => ({ id: r, name: r }))} value={formData.role || ''} onChange={handleChange} error={errors.role} />
            <InputField label="Department" name="department" value="ICT OFFICE" onChange={() => { }} disabled />
          </div>

          <div className="mt-8 text-right">
            <button onClick={() => validate() && setStep(2)} className="px-6 py-2 bg-neutral-800 text-white rounded-md">Next</button>
          </div>

          <div className="text-sm text-center mt-4">
            <button onClick={onSwitch} className="text-blue-600 underline cursor-pointer">Signup as regular user</button>
          </div>
        </>
      )}

      {!submitted && step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Review & Submit</h2>
          <p className="text-gray-600 mb-8">Submit for admin approval.</p>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="border px-6 py-2 rounded-md">Back</button>
            <button onClick={handleFinalSubmit} className="px-6 py-2 bg-green-600 text-white rounded-md">
              <CheckCircle className="w-5 h-5" /> Submit
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-neutral-500 animate-pulse mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">Submitted for Approval</h2>
          <p className="text-gray-600 mt-2">An admin will review your profile shortly.</p>
        </div>
      )}
    </div>
  );
};

export default SupportTeamForm;
