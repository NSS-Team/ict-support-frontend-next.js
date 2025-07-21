'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '~/trpc/react';
import { format } from 'date-fns';
import Loader from '~/app/_components/Loader';
import { File } from 'lucide-react';

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const { data: ticket, isLoading, error } = api.complaints.getComplainInfo.useQuery({ id });
  const complaint = ticket?.data?.complaint;
  const attachments = ticket?.data?.attachments || [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (error || !ticket) return <p className="p-10 text-red-500">Failed to load ticket details.</p>;

  return (
    <main className="min-h-screen bg-gray-50 font-sans pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pt-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center gap-4">
          <ArrowLeft
            className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800 transition"
            onClick={() => router.back()}
          />
          <h2 className="text-xl font-semibold text-blue-600">Ticket #{complaint?.id}</h2>

          <div className="ml-auto flex justify-end">
            <div className="flex gap-4 pointer-events-auto">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-md transition hover:cursor-pointer">
                Close Ticket
              </button>
              <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-md transition hover:cursor-pointer">
                Assign
              </button>
              <button className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded-md transition hover:cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{complaint?.title}</h1>
          <p className="text-gray-700">{complaint?.customDescription}</p>

          <div className="flex flex-wrap gap-12 pt-4 border-t border-gray-100 mt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Priority</h4>
              <p className="text-red-600 font-semibold capitalize">{complaint?.priority}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <p className="text-gray-800 font-medium capitalize">{complaint?.status}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Device</h4>
              <p className="text-gray-800 font-medium">{complaint?.device}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Escalation Level</h4>
              <p className="text-gray-800">{complaint?.escalationLevel}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 pt-4 mt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Category</h4>
              <p className="text-gray-800">{complaint?.categoryName || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Subcategory</h4>
              <p className="text-gray-800">{complaint?.subCategoryName || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Issue</h4>
              <p className="text-gray-800">{complaint?.issueOptionName || 'N/A'}</p>
            </div>
          </div>
        </div>


        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned Worker</h3>
            <p className="text-gray-800 font-medium">
              {complaint?.assignedWorker || 'Not assigned yet'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Submission Preference</h3>
            <p className="text-gray-800 font-medium capitalize">{complaint?.submissionPreference}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
            <p className="text-gray-800 font-medium">{complaint?.location}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Reported By</h3>
            <p className="text-gray-800">{complaint?.employeeName}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Team</h3>
            <p className="text-gray-800">{complaint?.categoryName}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Created At</h3>
            <p className="text-gray-700">
              {complaint?.createdAt
                ? format(new Date(complaint.createdAt), 'PPPpp')
                : 'Not available'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
            <p className="text-gray-700">
              {complaint?.updatedAt
                ? format(new Date(complaint.updatedAt), 'PPPpp')
                : 'Not available'}
            </p>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      {attachments && attachments.length > 0 && (
        <section className="max-w-4xl mx-auto mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map((attachment: { url: string }, index: number) => {
              const url = attachment.url;
              const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
              const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  {isImage ? (
                    <img
                      src={url}
                      alt={`attachment-${index}`}
                      className="object-cover w-full h-48"
                    />
                  ) : isVideo ? (
                    <video controls className="w-full h-48 object-cover">
                      <source src={url} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 hover:underline"
                    >
                      <File className="w-32 h-32 inline-block ml-auto" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}


    </main>
  );
}
