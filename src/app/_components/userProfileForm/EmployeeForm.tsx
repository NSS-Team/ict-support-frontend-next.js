'use client';

import { useState } from 'react';
import { useToast } from '../ToastProvider';
import { Clock, CheckCircle } from 'lucide-react';
import type { NustEmployee } from '~/types/user/nustEmployeeSchema';
import { api } from '~/trpc/react';
import { useUser } from '@clerk/nextjs';
import InputField from './InputField';
import SelectField from './SelectField';

interface Props {
  initialUser: NustEmployee;
  onSubmit: (data: Partial<NustEmployee>) => void;
  onSwitch: () => void;
}

const RegularUserForm = ({ initialUser, onSubmit, onSwitch }: Props) => {
    const { addToast } = useToast();
  const [formData, setFormData] = useState<Partial<NustEmployee>>(initialUser);
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // ro keep track of errors
  const [submitted, setSubmitted] = useState(false);

  const { user } = useUser(); // fetching the user from clerk
  const email = user?.emailAddresses[0]?.emailAddress ?? ''; // getting email from clerk user
  const { data: locationResponse = [], isLoading: isLocationsLoading } = api.locations.getLocations.useQuery();
  const locationOptions = Array.isArray(locationResponse) ? [] : locationResponse?.data ?? [];
  const { mutate: completeProfile, isPending: isSubmitting } = api.auth.completeProfile.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => addToast('Something went wrong!'),
  });

  const requiredFields: (keyof NustEmployee)[] = ['firstName', 'lastName', 'phone', 'locationId', 'designation'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
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

  const handleFinalSubmit = () => {
    // check if all required fields are filled
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !email ||
      !formData.locationId ||
      !formData.designation ||
      !formData.department ||
      !formData.officeNumber
    ) {
      return addToast('Missing fields');
    }

    completeProfile({
      firstName: formData.firstName as string,
      lastName: formData.lastName as string,
      email: email,
      phone: formData.phone as string,
      officeNumber: formData.officeNumber as string,
      department: formData.department as string,
      designation: formData.designation as string,
      locationId: formData.locationId as string,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {!submitted && step === 1 && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Complete Your Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleChange} error={errors.firstName} />
            <InputField label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleChange} error={errors.lastName} />
            <InputField label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} error={errors.phone} />
            <SelectField label="Location" name="locationId" options={locationOptions} value={formData.locationId || ''} onChange={handleChange} error={errors.locationId} />
            <InputField label="Department" name="department" value={formData.department || ''} onChange={handleChange} />
            <InputField label="Designation" name="designation" value={formData.designation || ''} onChange={handleChange} />
            <InputField label="Office Room No." name="officeNumber" value={formData.officeNumber || ''} onChange={handleChange} />
          </div>

          <div className="mt-8 text-right">
            <button onClick={() => validateStep() && setStep(2)} className="px-6 py-2 bg-neutral-800 text-white rounded-md">Next</button>
          </div>

          <div className="text-sm text-center mt-4">
            <button onClick={onSwitch} className="text-blue-600 underline cursor-pointer">Signup as support team</button>
          </div>
        </>
      )}

      {!submitted && step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Review & Submit</h2>
          <p className="text-gray-600 mb-8">Submit your profile for admin approval.</p>
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
          <p className="text-gray-600 mt-2">Admin will review your profile shortly.</p>
        </div>
      )}
    </div>
  );
};

export default RegularUserForm;
