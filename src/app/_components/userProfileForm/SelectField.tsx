import React from 'react';

interface Option {
  id: number | string;
  name: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  disabled?: boolean;
}

const SelectField = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  disabled = false,
}: SelectFieldProps) => (
  <div className="flex flex-col w-full">
    <label htmlFor={name} className="mb-1 font-medium text-neutral-600">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`rounded-md bg-white border px-4 py-2 focus:outline-none focus:ring-2 ${
        error
          ? 'border-red-500 focus:ring-red-300'
          : 'border-gray-300 focus:ring-neutral-300'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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

export default SelectField;
