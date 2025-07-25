'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error' ; 
  title?: string;
}

interface ToastContextProps {
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', title?: string) => void;
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

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', title?: string) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-17 right-5 flex flex-col gap-2 z-50 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem 
              key={toast.id} 
              toast={toast} 
              onRemove={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: () => void }) => {
  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    switch (toast.type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-amber-600`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-amber-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ 
        opacity: 0, 
        x: 400, 
        scale: 0.95,
        rotateX: -10
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        rotateX: 0
      }}
      exit={{ 
        opacity: 0, 
        x: 400, 
        scale: 0.95,
        rotateX: 10
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
      className={`
        bg-white border border-gray-200 ${getBorderColor()} border-l-4
        rounded-lg shadow-lg backdrop-blur-sm
        w-80 min-h-[80px] relative overflow-hidden
        pointer-events-auto
        hover:shadow-xl transition-shadow duration-200
      `}
      style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      <div className="p-4 pr-12">
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {toast.title}
              </h4>
            )}
            <p className="text-sm text-gray-700 leading-relaxed">
              {toast.message}
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
      

    </motion.div>
  );
};