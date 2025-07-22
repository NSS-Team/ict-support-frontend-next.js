'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react'; 
import Sidebar from '../_components/Sidebar';
import { priorityEnum, submissionPreferenceEnum, type SubmissionPreference } from '~/types/enums';
import { uploadAttachment } from '~/utils/complaintAttachmentsUpload';

export default function ComplaintForm() {
  const router = useRouter();
  
  type Upload = { file: File; note: string; type: string };
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

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categoriesResponse } = api.complaints.getCategories.useQuery();
  const categories = categoriesResponse?.data?.categories || [];
  const { data: subcategories } = api.complaints.getSubCategories.useQuery(
    { categoryId: form.categoryId },
    { enabled: !!form.categoryId }
  );
  const subCategories = subcategories?.data?.subCategories || [];
  const { data: issues } = api.complaints.getIssueOptions.useQuery(
    { subCategoryId: form.subCategoryId },
    { enabled: !!form.subCategoryId }
  );
  const issueOptions = issues?.data?.issueOptions || [];
  const handleBack = () => {
    router.back();
  };

  // api call for the complaint generation
  const generateComplain = api.complaints.generateComplain.useMutation({
    onSuccess: (data) => {
      console.log('Complaint generated successfully:', data);
    },
    onError: (error) => {
      console.error('Error generating complaint:', error);
    },
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newUploads = Array.from(files).map(file => ({
      file,
      note: '',
      type: getFileType(file)
    }));
    
    setForm((prev) => ({
      ...prev,
      uploads: [...prev.uploads, ...newUploads],
    }));
  };

  const getFileType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'Screenshot';
    if (file.type.startsWith('video/')) return 'Video';
    if (file.type === 'application/pdf' || file.type.startsWith('application/vnd.')) return 'Document';
    if (file.name.toLowerCase().includes('log') || file.type === 'text/plain') return 'Log File';
    return 'Other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

const updateUpload = (index: number, key: 'note' | 'type', value: string) => {
  const updated = [...form.uploads];
  const currentUpload = updated[index];
  
  if (currentUpload) {
    // Explicitly preserve all properties
    updated[index] = {
      file: currentUpload.file,
      note: key === 'note' ? value : currentUpload.note,
      type: key === 'type' ? value : currentUpload.type,
    };
    setForm((prev) => ({ ...prev, uploads: updated }));
  }
};

  const removeUpload = (index: number) => {
    const updated = [...form.uploads];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, uploads: updated }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.categoryId || !form.subCategoryId || !form.issueOptionId) {
      alert('Please fill all required fields.');
      return;
    }

    // Upload all files and get their URLs
    const uploadsWithUrls = await Promise.all(
      form.uploads.map(async (upload) => ({
        type: upload.type,
        url: await uploadAttachment(upload.file),
        note: upload.note || null,
      }))
    );

    generateComplain.mutate({
      categoryId: form.categoryId,
      subCategoryId: form.subCategoryId,
      issueOptionId: form.issueOptionId,
      customDescription: form.customDescription,
      submissionPreference: (["remote", "on_site", "call_back"].includes(form.submissionPreference) ? form.submissionPreference : "remote") as "remote" | "on_site" | "call_back",
      priority: (["low", "medium", "high", "urgent"].includes(form.priority) ? form.priority : "low") as "low" | "medium" | "high" | "urgent",
      title: form.title,
      device: form.device,
      uploads: uploadsWithUrls,
    });
  };

  interface Category {
    id: string;
    name: string;
  }

  interface SubCategory {
    id: string;
    name: string;
  }

  interface IssueOption {
    id: string | number;
    name: string;
  }

  const isOther: boolean =
    issueOptions?.find((i: IssueOption) => i.id.toString() === form.issueOptionId)?.name === 'Other (specify)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Main Form Container */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-white-600 px-8 py-6 rounded-t-2xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-2xl font-bold tracking-wide">Request a Support</h2>
                <p className="text-pink-100 text-sm mt-1">Fill in the required details to submit your request</p>
              </div>
              <button
                onClick={handleBack}
                className="flex items-center bg-gray-100 px-4 py-2 text-black text-sm font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-black/30 hover:bg-gray-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-800 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Complaint Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                placeholder="Brief description of your complaint"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            {/* Issue Classification */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                Issue Classification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all duration-200 bg-white text-gray-900"
                    value={form.categoryId}
                    onChange={(e) => {
                      handleChange('categoryId', e.target.value);
                      handleChange('subCategoryId', '');
                      handleChange('issueOptionId', '');
                    }}
                  >
                    <option value="">Select category</option>
                    {categories?.map((cat) =>
                      cat ? (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                    value={form.subCategoryId}
                    onChange={(e) => {
                      handleChange('subCategoryId', e.target.value);
                      handleChange('issueOptionId', '');
                    }}
                    disabled={!form.categoryId}
                  >
                    <option value="">Select subcategory</option>
                    {subCategories?.map((sub: SubCategory) => (
                      <option key={sub.id} value={sub.id}>
                      {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Specific Issue</label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
                    value={form.issueOptionId}
                    onChange={(e) => handleChange('issueOptionId', e.target.value)}
                    disabled={!form.subCategoryId}
                  >
                    <option value="">Select issue</option>
                    {issueOptions?.map((issue: IssueOption) => (
                      <option key={issue.id} value={issue.id}>
                      {issue.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Custom Description */}
            {isOther && (
              <div className="border-2 border-dashed border-orange-300 bg-orange-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800">Please describe your complaint</h4>
                    <p className="text-sm text-orange-600">Provide as much detail as possible to help us understand and resolve your concern</p>
                  </div>
                </div>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:ring-0 transition-all duration-200 resize-none text-gray-900 placeholder-orange-400"
                  placeholder="Please provide a detailed description of your complaint..."
                  value={form.customDescription}
                  onChange={(e) => handleChange('customDescription', e.target.value)}
                />
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                Additional Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Device/Platform</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Windows 11, iPhone 15"
                    value={form.device}
                    onChange={(e) => handleChange('device', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>


<select
  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all duration-200 bg-white text-gray-900"
  value={form.submissionPreference}
  onChange={(e) => handleChange('submissionPreference', e.target.value)}
>
  <option value="">Select contact method</option>
  {submissionPreferenceEnum.options.map((option) => (
    <option key={option} value={option}>
      {option.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
    </option>
  ))}
</select>



                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Priority Level</label>
                  {/* we will be displaying the priority level options here from the priority enum  */}
                  <select
  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all duration-200 bg-white text-gray-900"
  value={form.priority}
  onChange={(e) => handleChange('priority', e.target.value)}
>
  <option value="">Select priority</option>
  {priorityEnum.options.map((option) => (
    <option key={option} value={option}>
      {option.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
    </option>
  ))}
</select>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-purple-50 border-2 border-purple-100 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center mb-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    Supporting Documents
                  </h3>
                  <p className="text-sm text-gray-600">Add screenshots, documents, or other relevant files to support your complaint</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Browse Files
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  isDragOver
                    ? 'border-purple-400 bg-purple-100'
                    : 'border-purple-300 bg-white hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium text-gray-700 mb-2">Drop files here to upload</p>
                  <p className="text-sm text-gray-500 mb-4">or click "Browse Files" to select from your device</p>
                  <p className="text-xs text-gray-400">Supports: Images, Documents, Videos, Log Files (Max 10MB each)</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.log"
              />

              {/* Uploaded Files */}
              <div className="mt-6 space-y-4">
                {form.uploads.map((upload, index) => (
                  <div key={index} className="bg-white border-2 border-purple-200 rounded-xl p-4 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-xs">{upload.file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(upload.file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUpload(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Description</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-0 transition-all duration-200 text-sm"
                          placeholder="What does this file show?"
                          value={upload.note}
                          onChange={(e) => updateUpload(index, 'note', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">File Type</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-0 transition-all duration-200 text-sm bg-white"
                          value={upload.type}
                          onChange={(e) => updateUpload(index, 'type', e.target.value)}
                        >
                          <option value="">Select type</option>
                          <option value="Screenshot">📸 Screenshot</option>
                          <option value="Document">📄 Document</option>
                          <option value="Video">🎥 Video</option>
                          <option value="Log File">📋 Log File</option>
                          <option value="Other">📎 Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {form.uploads.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">No files uploaded</p>
                    <p className="text-xs text-gray-400 mt-1">Supporting documents help us understand your complaint better</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Section */}
            <div className="border-t-2 border-gray-100 pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <button
                  type="button"
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Save as Draft
                </button> */}
                <button
                  type="submit"
                  className="flex-1 text-white font-bold py-4 bg-blue-600 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
                  onClick={handleSubmit}
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Complaint
                  </div>
                </button>
              </div>
              
              {/* <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  📞 Need immediate assistance? Call our hotline: <span className="font-semibold text-red-600">1-800-COMPLAINTS</span>
                </p>
                <p className="text-xs text-gray-400">
                  We take all complaints seriously and aim to respond within 24-48 hours
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}