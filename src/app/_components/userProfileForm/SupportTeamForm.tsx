import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { api } from '~/trpc/react';
import InputField from './InputField';
import SelectField from './SelectField';
import type { supportStaffRoles } from '~/types/enums';
import type { SupportStaffMember } from '~/types/user/supportStaffMemberSchema';
import { supportStaffRolesEnum } from '~/types/enums';
import { useUserStatus } from '~/store/loginCheck';
// import { Router } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';
import { uploadProfileImage } from '~/utils/UploadProfileImage';
import { useToast } from '../ToastProvider';

interface Props {
  initialUser: SupportStaffMember;
  roleOptions: supportStaffRoles[];
  onSubmit: (data: Partial<SupportStaffMember>) => void;
  onSwitch: () => void;
}

const SupportTeamForm = ({ initialUser, roleOptions, onSubmit, onSwitch }: Props) => {
  const { addToast } = useToast();
  const { setExist, setApproved } = useUserStatus();
  const Router = useRouter();

  const [formData, setFormData] = useState<Partial<SupportStaffMember>>(initialUser);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  // const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? '';
  const { data: getTeamResponse = [], isLoading: isTeamLoading } = api.teams.getTeams.useQuery();
  const teamOptions = Array.isArray(getTeamResponse) ? [] : getTeamResponse?.data ?? [];
  const { mutate: completeProfileStaff, isPending: isSubmitting } = api.auth.completeProfileStaff.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setExist(true);
      setApproved(false);
      Router.refresh();
    },
    onError: () => alert('Something went wrong!'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFinalSubmit = async () => {
    console.log('Submitting form data:', formData);
    // Validate form data
    const isValid = validate();
    if (!isValid)
    {
      addToast('Please fill all required fields.');
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !email
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
      completeProfileStaff({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email,
        phone: formData.phone,
        role: formData.role || '',
        teamId: formData.teamId || '',
        picUrl: imageUrl,
      });
      addToast('Profile completed successfully!');
    } catch (error) {
      console.error('Profile submission failed:', error);
      addToast('Something went wrong while submitting the profile.');
    }

    // Submit profile with image URL
    // completeProfileStaff({
    //   firstName: formData.firstName,
    //   lastName: formData.lastName,
    //   email: email,
    //   phone: formData.phone,
    //   role: formData.role || '',
    //   teamId: formData.teamId || '',
    //   picUrl: imageUrl,
    // });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    (['firstName', 'lastName', 'phone', 'role', 'teamId'] as (keyof SupportStaffMember)[]).forEach((field) => {
      if (!formData[field]) newErrors[field as string] = `${field} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {!submitted && (
        <>
          <h2 className="text-2xl font-semibold mb-6">Support Team Signup</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleChange} error={errors.firstName} />
            <InputField label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleChange} error={errors.lastName} />
            <InputField label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} error={errors.phone} />
            <SelectField label="Role" name="role" options={supportStaffRolesEnum.options.map(r => ({ id: r, name: r }))} value={formData.role || ''} onChange={handleChange} error={errors.role} />
            <SelectField label="Team" name="teamId" options={teamOptions} value={formData.teamId || ''} onChange={handleChange} error={errors.teamId} />
            <InputField label="Department" name="department" value="ICT OFFICE" onChange={() => { }} disabled />
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
            <button onClick={onSwitch} className="text-blue-600 underline cursor-pointer">Signup as regular user</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SupportTeamForm;
