'use client';

import { useState } from 'react';
import { api } from '~/trpc/react'; // Adjust your tRPC import path

export default function ComplaintForm() {

    
  type Upload = { url: string; note: string; type: string };
  type FormState = {
    title: string;
    categoryId: string;
    subCategoryId: string;
    issueOptionId: string;
    customDescription: string;
    device: string;
    submissionPreference: string;
    priority: string;
    uploads: Upload[];
  };

  const [form, setForm] = useState<FormState>({
    title: '',
    categoryId: '',
    subCategoryId: '',
    issueOptionId: '',
    customDescription: '',
    device: '',
    submissionPreference: '',
    priority: '',
    uploads: [],
  });

  const { data: categories } = api.complaints.getCategories.useQuery();
  const { data: subcategories } = api.complaints.getSubCategories.useQuery(
    { categoryId: form.categoryId },
    { enabled: !!form.categoryId }
    );
  const { data: issues } = api.complaints.getIssueOptions.useQuery(
    { subCategoryId: form.subCategoryId },
    { enabled: !!form.subCategoryId }
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addUpload = () => {
    setForm((prev) => ({
      ...prev,
      uploads: [...prev.uploads, { url: '', note: '', type: '' }],
    }));
  };

  const updateUpload = (index: number, key: string, value: string) => {
    const updated = [...form.uploads];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, uploads: updated }));
  };

  const removeUpload = (index: number) => {
    const updated = [...form.uploads];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, uploads: updated }));
  };

  const isOther =
    issues?.find((i) => i.id.toString() === form.issueOptionId)?.name === 'Other (specify)';

  return (
    <form className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Submit a Complaint</h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={form.categoryId}
            onChange={(e) => {
              handleChange('categoryId', e.target.value);
              handleChange('subCategoryId', '');
              handleChange('issueOptionId', '');
            }}
          >
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={form.subCategoryId}
            onChange={(e) => {
              handleChange('subCategoryId', e.target.value);
              handleChange('issueOptionId', '');
            }}
            disabled={!form.categoryId}
          >
            <option value="">Select subcategory</option>
            {subcategories?.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Issue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={form.issueOptionId}
            onChange={(e) => handleChange('issueOptionId', e.target.value)}
            disabled={!form.subCategoryId}
          >
            <option value="">Select issue</option>
            {issues?.map((issue) => (
              <option key={issue.id} value={issue.id}>
                {issue.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Description */}
      {isOther && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            className="w-full border rounded-md px-3 py-2 resize-none"
            placeholder="Describe the issue"
            value={form.customDescription}
            onChange={(e) => handleChange('customDescription', e.target.value)}
          />
        </div>
      )}

      {/* Device, Preference, Priority */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={form.device}
            onChange={(e) => handleChange('device', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Submission Preference</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={form.submissionPreference}
            onChange={(e) => handleChange('submissionPreference', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="">Select priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Uploads Section */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-800">Attachments (optional)</h3>
          <button
            type="button"
            onClick={addUpload}
            className="text-sm px-3 py-1 border rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            + Add
          </button>
        </div>

        {form.uploads.map((upload, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={upload.url}
                onChange={(e) => updateUpload(index, 'url', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                value={upload.note}
                onChange={(e) => updateUpload(index, 'note', e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  value={upload.type}
                  onChange={(e) => updateUpload(index, 'type', e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeUpload(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
      >
        Submit Complaint
      </button>
    </form>
  );
}
