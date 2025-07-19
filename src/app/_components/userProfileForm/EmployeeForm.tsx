'use client';

import { useState } from 'react';
import { useToast } from '../ToastProvider';
import type { NustEmployee } from '~/types/user/nustEmployeeSchema';
import { api } from '~/trpc/react';
import { useUser } from '@clerk/nextjs';
import InputField from './InputField';
import SelectField from './SelectField';
import { useRouter } from 'next/navigation';
import { useUserStatus } from '~/store/loginCheck';
import { uploadProfileImage } from '~/utils/UploadProfileImage';
import { UploadCloud } from "lucide-react";

interface Props {
  initialUser: NustEmployee;
  onSubmit: (data: Partial<NustEmployee>) => void;
  onSwitch: () => void;
}

const RegularUserForm = ({ initialUser, onSwitch }: Props) => {
  const { setExist, setApproved } = useUserStatus();
  const Router = useRouter();
  const { addToast } = useToast();
  const [formData, setFormData] = useState<Partial<NustEmployee>>(initialUser);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  // const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // ro keep track of errors
  const [submitted, setSubmitted] = useState(false);

  const { user } = useUser(); // fetching the user from clerk
  const email = user?.emailAddresses[0]?.emailAddress ?? ''; // getting email from clerk user
  const { data: locationResponse = [] } = api.locations.getLocations.useQuery();
  const locationOptions = Array.isArray(locationResponse) ? [] : locationResponse?.data ?? [];

  const { mutate: completeProfile, isPending: isSubmitting } = api.auth.completeProfile.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setExist(true);
      setApproved(false);
      Router.refresh();
    },
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

  const handleFinalSubmit = async () => {
    const isValid = validateStep();
    if (!isValid) return;

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
      addToast('Please fill all required fields.');
      return;
    }

    let imageUrl = '';

    // If image selected, upload to Cloudinary
    if (profileImage) {
      try {
        imageUrl = await uploadProfileImage(profileImage);
      } catch (error) {
        console.error('Image upload failed:', error);
        addToast('Image upload failed! Only jpg, png, webp are allowed.');
        return; // Prevent sending request to backend
      }
    }

    try {
      completeProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email,
        phone: formData.phone,
        officeNumber: formData.officeNumber,
        department: formData.department,
        designation: formData.designation,
        locationId: formData.locationId,
        picUrl: imageUrl, // safe to be empty if no image
      });

      addToast('Profile completed successfully!');
    } catch (error) {
      console.error('Profile submission failed:', error);
      addToast('Something went wrong while submitting the profile.');
    }

    // Submit profile with image URL
    // completeProfile({
    //   firstName: formData.firstName,
    //   lastName: formData.lastName,
    //   email: email,
    //   phone: formData.phone,
    //   officeNumber: formData.officeNumber,
    //   department: formData.department,
    //   designation: formData.designation,
    //   locationId: formData.locationId,
    //   picUrl: imageUrl,
    // });
  };


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {!submitted && (
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
            <div className="relative w-full mt-1">
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md shadow-sm bg-white text-gray-600 cursor-pointer hover:border-blue-400 transition-all duration-200">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Choose an image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="mt-8 text-right">
            <button onClick={() => handleFinalSubmit()} className="px-6 py-2 bg-neutral-800 text-white rounded-md">Submit for Approval</button>
          </div>

          <div className="text-sm text-center mt-4">
            <button onClick={onSwitch} className="text-blue-600 underline cursor-pointer">Signup as support team</button>
          </div>
        </>
      )}
    </div>
  );
};

export default RegularUserForm;
