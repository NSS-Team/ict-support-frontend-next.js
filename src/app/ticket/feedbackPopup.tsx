'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Star, X, RotateCcw, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';

interface FeedbackPopupProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string | number;
  ticketTitle: string;
  onSubmitFeedback: (feedback: FeedbackData) => void;
  onReopenTicket: () => void;
  isSubmitting?: boolean;
}

interface FeedbackData {
  rating: number;
  comment?: string;
  action: 'close' | 'reopen';
}

export default function FeedbackPopup({
  isOpen,
  onClose,
  ticketId,
  ticketTitle,
  onSubmitFeedback,
  onReopenTicket,
  isSubmitting = false
}: FeedbackPopupProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleStarHover = (star: number) => {
    setHoverRating(star);
  };

  const handleSubmitFeedback = () => {
    onSubmitFeedback({
      rating,
      comment: comment.trim() || undefined,
      action: 'close'
    });
  };

  const handleReopenTicket = () => {
    onSubmitFeedback({
      rating: 0,
      comment: undefined,
      action: 'reopen'
    });
    onReopenTicket();
  };

  const handleShowFeedback = () => {
    setShowFeedbackForm(true);
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setShowFeedbackForm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Very Poor';
      case 2: return 'Poor';
      case 3: return 'Average';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Rate your experience';
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  Ticket Resolution
                </Dialog.Title>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ID:</span> #{ticketId}
                  </p>
                  <p className="text-sm text-gray-700 break-words">
                    <span className="font-medium">Title:</span> {ticketTitle}
                  </p>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-5 sm:py-6">
            {!showFeedbackForm ? (
              /* Initial Options */
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ticket Resolved!
                  </h3>
                  <p className="text-sm text-gray-600">
                    How was your experience with our support team?
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Close with Feedback */}
                  <button
                    onClick={handleShowFeedback}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors touch-manipulation"
                  >
                    <Star className="w-4 h-4" />
                    <span>Close & Leave Feedback</span>
                  </button>

                  {/* Reopen Ticket */}
                  <button
                    onClick={handleReopenTicket}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-medium rounded-lg transition-colors touch-manipulation"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Not Satisfied? Reopen Ticket</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Feedback Form */
              <div className="space-y-6">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Share Your Feedback
                  </h3>
                  <p className="text-sm text-gray-600">
                    Help us improve our service
                  </p>
                </div>

                {/* Star Rating */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Rate Your Experience
                  </label>
                  
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 touch-manipulation"
                        type="button"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-center text-sm font-medium text-gray-700">
                    {getRatingText(hoverRating || rating)}
                  </p>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700">
                    Additional Comments <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    id="feedback-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {comment.length}/500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 touch-manipulation"
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting || rating === 0}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 touch-manipulation"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </div>

                {rating === 0 && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Please select a rating to continue</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}