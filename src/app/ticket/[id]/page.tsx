'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, MapPin, Clock, FileText, Paperclip, AlertTriangle, Settings, Trash2, MoreVertical, Edit3, MessageSquare, Eye } from 'lucide-react';
import { api } from '~/trpc/react';
import { format } from 'date-fns';
import Loader from '~/app/_components/Loader';
import { File } from 'lucide-react';
import { priorityColorMap } from '~/lib/PriorityColorMap';
import { complaintStatusColorMap } from '~/lib/statusColorMap';

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const { data: ticket, isLoading, error } = api.complaints.getComplainInfo.useQuery({ id });
  const complaint = ticket?.data?.complaint;
  const attachments = ticket?.data?.attachments || [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader />
          <p className="text-sm text-gray-500">Loading ticket details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-red-100 p-8 max-w-md mx-auto">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <div className="p-2 bg-red-50 rounded-full">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="font-semibold">Unable to Load Ticket</span>
          </div>
          <p className="text-gray-600 mb-6">We encountered an error while loading the ticket details. Please try refreshing the page or contact support if the issue persists.</p>
          <button 
            onClick={() => router.back()}
            className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Mobile-First Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  Ticket #{complaint?.id}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Support Request Details</p>
              </div>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                <Clock className="h-4 w-4 mr-2" />
                Close Ticket
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                <User className="h-4 w-4 mr-2" />
                Assign
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <div className="flex items-center">
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="lg:hidden px-4 py-3 bg-gray-50 border-t border-gray-200 w-full">
          <div className="flex space-x-2 max-w-full">
            <button className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              <User className="h-4 w-4 mr-2" />
              Assign
            </button>
            <button className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
              <Clock className="h-4 w-4 mr-2" />
              Close
            </button>
            <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-32 overflow-hidden">
        {/* Priority Banner - Mobile Optimized */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">{complaint?.title}</h2>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{complaint?.customDescription}</p>
                </div>
              </div>
            </div>
            
            {/* Status Pills - Mobile Scrollable */}
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 w-full">
              <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:overflow-visible sm:flex-wrap -mx-1 px-1">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</span>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${priorityColorMap[complaint?.priority?.toLowerCase() ?? ''] || priorityColorMap.default}`}>
                    {complaint?.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${complaintStatusColorMap[complaint?.status?.toLowerCase() ?? ''] || complaintStatusColorMap.default}`}>
                    {complaint?.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Level</span>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-800 rounded-full">
                    {complaint?.escalationLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content - Full width on mobile, 2/3 on desktop */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Quick Stats - Mobile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500">Assigned To</p>
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {complaint?.assignedWorker || (
                        <span className="text-amber-600 italic">Unassigned</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-base font-semibold text-gray-900 truncate">{complaint?.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  Technical Information
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Device</label>
                    <p className="text-gray-900 font-medium break-words">{complaint?.device || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900 font-medium">{complaint?.categoryName || 'Uncategorized'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Subcategory</label>
                    <p className="text-gray-900 font-medium">{complaint?.subCategoryName || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Issue Type</label>
                    <p className="text-gray-900 font-medium">{complaint?.issueOptionName || 'General'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments - Mobile Optimized */}
            {attachments && attachments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-gray-500" />
                    Attachments ({attachments.length})
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {attachments.map((attachment: { url: string }, index: number) => {
                      const url = attachment.url;
                      const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                      const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

                      return (
                        <div
                          key={index}
                          className="group relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 hover:shadow-md transition-all duration-200"
                        >
                          {isImage ? (
                            <div className="relative">
                              <img
                                src={url}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-24 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          ) : isVideo ? (
                            <video controls className="w-full h-24 sm:h-32 object-cover">
                              <source src={url} />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center h-24 sm:h-32 p-2 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <File className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1" />
                              <span className="text-xs font-medium text-gray-600 text-center truncate w-full">Document</span>
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Stack on mobile */}
          <div className="space-y-6">
            
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  Contact Details
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Reported By</label>
                  <p className="text-gray-900 font-medium">{complaint?.employeeName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Team</label>
                  <p className="text-gray-900">{complaint?.categoryName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Submission Method</label>
                  <p className="text-gray-900 capitalize">{complaint?.submissionPreference}</p>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  Timeline
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-500">
                      {complaint?.createdAt
                        ? format(new Date(complaint.createdAt), 'PPp')
                        : 'Not available'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-500">
                      {complaint?.updatedAt
                        ? format(new Date(complaint.updatedAt), 'PPp')
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Mobile */}
            <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  Add Comment
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors">
                  <Edit3 className="h-4 w-4" />
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}