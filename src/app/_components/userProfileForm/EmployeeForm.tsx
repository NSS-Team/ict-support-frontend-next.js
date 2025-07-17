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

interface Props {
  initialUser: NustEmployee;
  onSubmit: (data: Partial<NustEmployee>) => void;
  onSwitch: () => void;
}

const RegularUserForm = ({ initialUser, onSubmit, onSwitch }: Props) => {
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
  const { data: locationResponse = [], isLoading: isLocationsLoading } = api.locations.getLocations.useQuery();
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
    console.log('Uploading image:', profileImage);

    const imageData = new FormData();
    imageData.append('file', profileImage);
    imageData.append('upload_preset', 'frontend'); 
    imageData.append('folder', 'profile_pictures'); // Replace with your cloud name

    console.log('FormData prepared:', Array.from(imageData.entries()));

    const res = await fetch('https://api.cloudinary.com/v1_1/ddrcc3pf0/image/upload', {
      method: 'POST',
      body: imageData,
    });

    console.log('Cloudinary response status:', res.status);

    const data = await res.json();
    console.log('Cloudinary response data:', data);

    imageUrl = data.secure_url;
    if (!imageUrl) {
      console.error('No secure_url returned from Cloudinary:', data);
      addToast('Image upload failed: No URL returned!');
      return;
    }
  } catch (error) {
    console.error('Image upload failed:', error);
    addToast('Image upload failed!');
    return;
  }
}

  // Submit profile with image URL
  completeProfile({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: email,
    phone: formData.phone,
    officeNumber: formData.officeNumber,
    department: formData.department,
    designation: formData.designation,
    locationId: formData.locationId,
    picUrl: imageUrl, // <-- send image URL here
  });
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
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mt-8 text-right">
            <button onClick={() => handleFinalSubmit()} className="px-6 py-2 bg-neutral-800 text-white rounded-md">Next</button>
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
