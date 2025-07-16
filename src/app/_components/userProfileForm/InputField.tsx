import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
}: InputFieldProps) => (
  <div className="flex flex-col w-full">
    <label htmlFor={name} className="mb-1 font-medium text-neutral-600">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`rounded-md bg-white border px-4 py-2 focus:outline-none focus:ring-2 ${ error? 'border-red-500 focus:ring-red-300': 'border-gray-300 focus:ring-neutral-300'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default InputField;
