'use client';

import { useState } from 'react';
import type User from '~/types/user';

interface Props {
  initialUser: User;
  roleOptions: string[];
  designationOptions: string[];
  departmentOptions: string[];
  locationOptions: string[];
  onSubmit: (data: Partial<User>) => void;
}

const UserInfoForm = ({
  initialUser,
  roleOptions,
  designationOptions,
  departmentOptions,
  locationOptions,
  onSubmit,
}: Props) => {
  const [formData, setFormData] = useState<Partial<User>>(initialUser);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl shadow-sm"
    >
      <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
        Complete Your Profile
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">
        <InputField
          label="Full Name"
          name="fullName"
          value={formData.fullName || ''}
          onChange={handleChange}
        />
        <InputField
          label="Phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
        />

        <SelectField
          label="Department"
          name="department"
          options={departmentOptions}
          value={formData.department || ''}
          onChange={handleChange}
        />

        <SelectField
          label="Designation"
          name="designation"
          options={designationOptions}
          value={formData.designation || ''}
          onChange={handleChange}
        />

        <SelectField
          label="Location"
          name="locationId"
          options={locationOptions}
          value={formData.locationId || ''}
          onChange={handleChange}
        />

        <SelectField
          label="Role"
          name="role"
          options={roleOptions}
          value={formData.role || ''}
          onChange={handleChange}
        />
      </div>

      <div className="mt-8 text-right">
        <button
          type="submit"
          className="px-6 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;

interface InputFieldProps {
  label: string;
  name: keyof User;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
}: InputFieldProps) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium text-neutral-600">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="rounded-md bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  name: keyof User;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField = ({
  label,
  name,
  options,
  value,
  onChange,
}: SelectFieldProps) => (
  <div className="flex flex-col">
    <label className="mb-1 font-medium text-neutral-600">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="rounded-md bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-300"
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
