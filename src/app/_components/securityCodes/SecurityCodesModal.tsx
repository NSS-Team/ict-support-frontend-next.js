'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
} from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';

interface SecurityCodesModalProps {
  codes: string[];
  onClose: () => void;
}

const SecurityCodesModal = ({ codes, onClose }: SecurityCodesModalProps) => {
  const [copied, setCopied] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const loading = codes.length === 0;

  const handleCopy = async () => {
    const codeText = codes.join('\n');
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const codeText = [
      `Security Codes - Generated on ${new Date().toLocaleString()}`,
      `Keep these codes safe and secure!`,
      ``,
      ...codes,
    ].join('\n');

    const blob = new Blob([codeText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `security_codes_${timestamp}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Dialog open>
      <DialogOverlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity" />
      <DialogContent asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6"
        >
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            🔐 Your Security Codes
          </DialogTitle>

          {loading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Generating codes, please wait...</p>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-gray-600">
                Please save or copy these codes now. For security reasons, you will not be able to view them again.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-52 overflow-y-auto space-y-2 shadow-inner">
                {codes.map((code, index) => (
                  <div key={index} className="font-mono text-sm text-gray-900 tracking-wide text-center">
                    {code}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={handleCopy}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white text-sm font-medium transition-all duration-150 shadow hover:shadow-md ${
                loading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {copied ? '✅ Copied' : '📋 Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white text-sm font-medium transition-all duration-150 shadow hover:shadow-md ${
                loading
                  ? 'bg-green-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              ⬇️ Download .txt
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              id="acknowledge"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
            />
            <label htmlFor="acknowledge">I’ve saved these codes securely</label>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              disabled={!acknowledged || loading}
              className={`mt-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow ${
                !loading && acknowledged
                  ? 'bg-gray-800 text-white hover:bg-gray-900 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Close
            </button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityCodesModal;
