'use client';

import { useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import type User from '~/types/user';
import type { UserRole } from '~/types/user';
import { api } from '~/trpc/react';
import { useUser } from '@clerk/nextjs';

interface Props {
  initialUser: User;
  roleOptions: UserRole[];
  onSubmit: (data: Partial<User>) => void;
}

const requiredFields: (keyof User)[] = [
  'fullName',
  'phone',
  'locationId',
  'role',
  'department',
  'designation',
  'officeNumber',
];

const UserInfoForm = ({ initialUser, roleOptions, onSubmit }: Props) => {
  const [formData, setFormData] = useState<Partial<User>>(initialUser);
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? '';

  const { data: locationOptions = [], isLoading: isLocationsLoading } =
    api.auth.getLocations.useQuery();

  const { mutate: completeProfile, isPending: isSubmitting } =
    api.auth.completeProfile.useMutation({
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: (err) => {
        console.error('Submission error:', err);
        alert('Something went wrong!');
      },
    });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log('handleChange', e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field]?.toString().trim() === '') {
        newErrors[field] = `${field} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleFinalSubmit = () => {
    if (!formData.fullName || !email) {
      alert('Full Name and Email are required');
      return;
    }

    completeProfile({
      name: formData.fullName,
      email,
      fullName: formData.fullName,
      phone: formData.phone || '',
      locationId: formData.locationId || '',
      role: formData.role || '',
      department: formData.department || '',
      designation: formData.designation || '',
      officeNumber: formData.officeNumber || '',
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-md">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-neutral-700 mb-1">
          Step {step}/2
        </div>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className={`h-2 rounded bg-neutral-800 transition-all duration-300 ${
              step === 1 ? 'w-1/2' : 'w-full'
            }`}
          />
        </div>
      </div>

      {/* Step 1 */}
      {!submitted && step === 1 && (
        <>
          <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
            Complete Your Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <InputField label="Full Name" name="fullName" value={formData.fullName || ''} onChange={handleChange} error={errors.fullName} />
            <InputField label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} error={errors.phone} />
            <SelectField
              label="Location"
              name="locationId"
              options={locationOptions.map((loc, i) => ({
                id: loc.id ?? i,
                name: loc.name,
              }))}
              value={formData.locationId || ''}
              onChange={handleChange}
              error={errors.locationId}
            />
            <SelectField
              label="Role"
              name="role"
              options={roleOptions.map((role, index) => ({ name: role, id: role }))}
              value={formData.role || ''}
              onChange={handleChange}
              error={errors.role}
            />
          </div>
          <InputField label="Department" name="department" value={formData.department || ''} onChange={handleChange} error={errors.department} />
          <InputField label="Designation" name="designation" value={formData.designation || ''} onChange={handleChange} error={errors.designation} />
          <InputField label="Office Room No." name="officeNumber" value={formData.officeNumber || ''} onChange={handleChange} error={errors.officeNumber} />
          <div className="mt-8 text-right">
            <button type="button" onClick={handleNext} className="px-6 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition">
              Next
            </button>
          </div>
        </>
      )}

      {/* Step 2 */}
      {!submitted && step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
            Review & Submit
          </h2>
          <p className="text-gray-600 mb-8">
            Your profile is ready. Submit it for admin approval.
          </p>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              Back
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className={`px-6 py-2 flex items-center gap-2 rounded-md transition text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              {isSubmitting ? 'Submitting...' : 'Submit for Admin Approval'}
            </button>
          </div>
        </div>
      )}

      {/* Submitted Screen */}
      {submitted && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-neutral-500 animate-pulse mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            Submitted for Approval
          </h2>
          <p className="text-gray-600 mt-2">
            Your request has been sent. An admin will review your profile shortly.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInfoForm;

interface InputFieldProps {
  label: string;
  name: keyof User;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  error,
}: InputFieldProps) => (
  <div className="flex flex-col w-full">
    <label className="mb-1 font-medium text-neutral-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`rounded-md bg-white border px-4 py-2 focus:outline-none focus:ring-2 ${
        error
          ? 'border-red-500 focus:ring-red-300'
          : 'border-gray-300 focus:ring-neutral-300'
      }`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

interface SelectFieldProps {
  label: string;
  name: keyof User;
  options: { id: number | string; name: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const SelectField = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
}: SelectFieldProps) => (
  <div className="flex flex-col w-full">
    <label className="mb-1 font-medium text-neutral-600">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`rounded-md bg-white border px-4 py-2 focus:outline-none focus:ring-2 ${
        error
          ? 'border-red-500 focus:ring-red-300'
          : 'border-gray-300 focus:ring-neutral-300'
      }`}
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);
