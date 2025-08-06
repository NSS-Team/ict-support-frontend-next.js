'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface VerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const VerificationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Complaint",
  message = "Are you sure you want to delete this complaint? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger"
}: VerificationDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          borderColor: 'border-red-200'
        };
      case 'warning':
        return {
          iconColor: 'text-amber-600',
          iconBg: 'bg-amber-100',
          confirmButton: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
          borderColor: 'border-amber-200'
        };
      default:
        return {
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          borderColor: 'border-blue-200'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.9,
                y: 20
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.9,
                y: 20
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              className={`
                bg-white rounded-xl shadow-2xl border ${styles.borderColor}
                w-full max-w-md mx-auto relative
                overflow-hidden
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`
                    ${styles.iconBg} rounded-full p-3 flex-shrink-0
                  `}>
                    <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="
                      px-4 py-2 text-sm font-medium text-gray-700 
                      bg-white border border-gray-300 rounded-lg
                      hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-150
                    "
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`
                      px-4 py-2 text-sm font-medium text-white rounded-lg
                      ${styles.confirmButton}
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-150
                    `}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Deleting...
                      </div>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};