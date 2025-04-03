'use client';

import { ReactNode } from 'react';
import { RiCloseLine as CloseIcon} from '@remixicon/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40" 
        onClick={onClose}
        role="presentation"
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-4 max-h-[80vh] sm:p-6 bg-card border-t border-border 
                    shadow-lg rounded-lg flex flex-col ${className} sm:mx-auto sm:my-8
                    sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto flex-1 flex flex-col min-h-0 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close modal"
            >
              <CloseIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Scrollable content with hidden scrollbar */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>
      </div>

      {/* Add global scrollbar styling */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}