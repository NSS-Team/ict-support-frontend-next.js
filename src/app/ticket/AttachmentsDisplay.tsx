'use client';

import { User, Wrench, File } from 'lucide-react';

interface Attachment {
  url: string;
  note?: string;
  uploaderName?: string;
  uploaderId?: string;
  role?: string;
  type?: string;
}

interface AttachmentsDisplayProps {
  employeeAttachments?: Attachment[];
  workerAttachments?: Attachment[];
  onImageClick?: (url: string) => void;
}

export default function AttachmentsDisplay({ 
  employeeAttachments = [], 
  workerAttachments = [], 
  onImageClick 
}: AttachmentsDisplayProps) {
  
  const renderAttachmentGrid = (attachments: Attachment[], type: 'employee' | 'worker') => {
    const isEmployee = type === 'employee';
    const roleLabel = isEmployee ? 'E' : 'W';

    // Define complete theme classes for each type
    const themeClasses = isEmployee ? {
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      hoverBgColor: 'hover:bg-blue-100',
      badgeBgColor: 'bg-blue-500',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-600',
      footerBgColor: 'bg-blue-50',
      footerBorderColor: 'border-blue-200',
      footerTextColor: 'text-blue-700'
    } : {
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50',
      hoverBgColor: 'hover:bg-green-100',
      badgeBgColor: 'bg-green-500',
      iconColor: 'text-green-500',
      textColor: 'text-green-600',
      footerBgColor: 'bg-green-50',
      footerBorderColor: 'border-green-200',
      footerTextColor: 'text-green-700'
    };

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {attachments.map((attachment, index) => {
          const url = attachment.url;
          const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
          const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

          return (
            <div
              key={`${type}-${index}`}
              className={`group relative rounded-md sm:rounded-lg border ${themeClasses.borderColor} overflow-hidden ${themeClasses.bgColor} hover:shadow-md transition-all duration-200 touch-manipulation`}
              onClick={() => isImage && onImageClick?.(url)}
            >
              {isImage ? (
                <div className="relative">
                  <img
                    src={url}
                    alt={`${isEmployee ? 'Employee' : 'Worker'} Attachment ${index + 1}`}
                    className="w-full h-20 sm:h-24 lg:h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className={`absolute top-1 right-1 ${themeClasses.badgeBgColor} text-white text-xs px-1.5 py-0.5 rounded-full`}>
                    {roleLabel}
                  </div>
                  {attachment.note && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {attachment.note}
                    </div>
                  )}
                </div>
              ) : isVideo ? (
                <div className="relative">
                  <video controls className="w-full h-20 sm:h-24 lg:h-32 object-cover">
                    <source src={url} />
                    Your browser does not support the video tag.
                  </video>
                  <div className={`absolute top-1 right-1 ${themeClasses.badgeBgColor} text-white text-xs px-1.5 py-0.5 rounded-full`}>
                    {roleLabel}
                  </div>
                </div>
              ) : (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center h-20 sm:h-24 lg:h-32 p-2 ${themeClasses.hoverBgColor} transition-colors duration-200 touch-manipulation relative`}
                >
                  <File className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${themeClasses.iconColor} mb-1`} />
                  <div className={`absolute top-1 right-1 ${themeClasses.badgeBgColor} text-white text-xs px-1.5 py-0.5 rounded-full`}>
                    {roleLabel}
                  </div>
                  <span className={`text-xs font-medium ${themeClasses.textColor} text-center truncate w-full`}>Document</span>
                </a>
              )}
              {attachment.uploaderName && (
                <div className={`px-2 py-1 ${themeClasses.footerBgColor} border-t ${themeClasses.footerBorderColor}`}>
                  <p className={`text-xs ${themeClasses.footerTextColor} font-medium truncate`}>
                    {attachment.uploaderName}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Employee Attachments - Mobile Optimized */}
      {employeeAttachments && employeeAttachments.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-100 bg-blue-50">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="hidden sm:inline">Employee Attachments ({employeeAttachments.length})</span>
              <span className="sm:hidden">Employee Files ({employeeAttachments.length})</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                Initial Report
              </span>
            </h3>
          </div>
          <div className="p-3 sm:p-4 lg:p-6">
            {renderAttachmentGrid(employeeAttachments, 'employee')}
          </div>
        </div>
      )}

      {/* Worker Attachments - Mobile Optimized */}
      {workerAttachments && workerAttachments.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-100 bg-green-50">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span className="hidden sm:inline">Worker Attachments ({workerAttachments.length})</span>
              <span className="sm:hidden">Worker Files ({workerAttachments.length})</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Resolution
              </span>
            </h3>
          </div>
          <div className="p-3 sm:p-4 lg:p-6">
            {renderAttachmentGrid(workerAttachments, 'worker')}
          </div>
        </div>
      )}
    </>
  );
}
