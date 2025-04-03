'use client';

import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import {
  RiFileCopyLine as CopyIcon,
  RiDownloadLine as DownloadIcon,
  RiGlobalLine as PublicIcon 
} from '@remixicon/react';
import Button from '@/components/Button';
import Modal from '@/components/Modal'

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardId: string;
  is_public?: boolean;
  onTogglePublic: (value: boolean) => void;
}

export default function ShareModal({ 
  isOpen, 
  onClose, 
  dashboardId,
  is_public,
  onTogglePublic
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${dashboardId}/view`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const qrCode = qrRef.current.querySelector('svg');
    
    if (!context || !qrCode) return;

    const data = new XMLSerializer().serializeToString(qrCode);
    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = DOMURL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `dashboard-${dashboardId}-qr.png`;
      downloadLink.click();
    };
    img.src = url;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Dashboard"
      className="sm:max-w-md"
    >
      {/* Public Toggle */}
      <div className="flex justify-between items-center px-2 py-3 border-b gap-2">
        <div className="flex items-center gap-2">
          <PublicIcon className="w-5 h-5 text-primary shrink-0" />
          <div>
            <h3 className="font-medium">Public Access</h3>
            <p className="text-xs text-muted-foreground">
              Toggle to make dashboard publicly visible
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={is_public}
            onChange={(e) => onTogglePublic(e.target.checked)}
            aria-label="Toggle public access"
          />
          <div className={`w-10 h-6 rounded-full p-1 transition-colors flex items-center ${
            is_public ? 'bg-primary' : 'bg-border'
          }`}
          >
            <div
              className={`w-4 h-4 bg-background rounded-full transition-transform duration-300 ${
                is_public ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>

      {/* QR Code Section */}
      <div className="p-4 space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <div 
            ref={qrRef}
            className={`p-1 bg-white`}
          >
          <QRCode 
            value={shareUrl}
            size={128}
            fgColor={is_public ? "#000000" : "#BDBDBD"}
          />

          </div>
          <Button
            icon={<DownloadIcon />}
            variant={is_public ? "primary" : "muted"}
            onClick={handleDownloadQR}
            disabled={!is_public}
          >
            Download QR 
          </Button>
        </div>

        {/* Share URL Section */}
        <div className="flex items-center gap-2">
          <input 
            type="text"
            readOnly
            value={shareUrl}
            className={`w-full px-3 py-2 bg-transparent border rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-ring
                        ${is_public ? '' : 'opacity-50 cursor-not-allowed'}`}
          />
          <Button
            icon={<CopyIcon />}
            variant={is_public ? "primary" : "muted"}
            className="p-3"
            onClick={handleCopy}
            disabled={!is_public}
          />
        </div>
      </div>
    </Modal>
  );
}