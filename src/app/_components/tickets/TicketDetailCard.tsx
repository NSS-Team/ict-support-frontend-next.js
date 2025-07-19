'use client';

import { ArrowLeft } from 'lucide-react';

export default function TicketDetailCard() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-6">
        <ArrowLeft className="text-gray-600 cursor-pointer" />
        <h2 className="text-blue-600 font-semibold text-lg ml-4">Ticket #11341</h2>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-1">Internet Connectivity issue</h1>

      <div className="mb-6">
        <h2 className="text-md font-semibold text-gray-700 mb-1">Description</h2>
        <p className="text-gray-600 leading-relaxed">
          The issue seems serious. like tbh fr its damn serious. The issue seems serious. like tbh fr its damn serious.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-md font-semibold text-gray-700 mb-1">Priority</h2>
        <p className="text-gray-800 font-medium">High</p>
      </div>

      <div className="mb-6">
        <h2 className="text-md font-semibold text-gray-700 mb-1">Current Status</h2>
        <p className="text-gray-800 font-medium">Assigned</p>
      </div>

      <div className="mb-6">
        <h2 className="text-md font-semibold text-gray-700 mb-2">Attachments</h2>
        <div className="flex flex-wrap gap-2">
          {['Attachment_1', 'Attachment_1', 'Attachment_1'].map((att, index) => (
            <span
              key={index}
              className="bg-gray-200 text-sm text-gray-700 px-4 py-1 rounded-full shadow-sm hover:bg-gray-300 cursor-pointer transition"
            >
              {att}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-5 py-2 rounded-md shadow transition">
          Close Ticket
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow transition">
          Assign
        </button>
      </div>
    </div>
  );
}
