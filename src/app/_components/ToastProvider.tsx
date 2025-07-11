'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Toast {
  id: number;
  message: string;
}

interface ToastContextProps {
  addToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

let toastId = 0;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} message={toast.message} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ message }: { message: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 20 }}
      className="bg-neutral-800 text-white px-4 py-3 rounded-lg shadow-lg w-72 relative overflow-hidden"
    >
      <p className="text-sm">{message}</p>
      <div className="absolute bottom-0 left-0 h-1 bg-green-500 animate-toast-bar" />
    </motion.div>
  );
};
