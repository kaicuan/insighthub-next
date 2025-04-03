'use client';

import {
  RiCloseLine as CloseIcon,
  RiUploadCloudLine as UploadIcon
} from '@remixicon/react';
import { useState } from 'react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

interface CreateModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (title: string, file: File) => void;
}

export default function CreateDashboardModal({ 
  show, 
  onClose, 
  onCreate 
}: CreateModalProps) {
  const [title, setTitle] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (csvFile && title) {
      onCreate(title, csvFile);
      setTitle('');
      setCsvFile(null);
    }
  };

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      title="Create New Dashboard"
      className="sm:max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block font-medium text-primary mb-1">
            Dashboard Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter dashboard title"
            className="w-full px-3 py-2 bg-transparent border 
                      rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        {/* Dataset Upload */}
        <div className="space-y-2">
          <label 
            htmlFor="csvFile" 
            className="block font-medium text-primary"
          >
            Upload Dataset File
          </label>
          <div className="relative rounded-lg border-2 border-dashed 
                        p-4 text-center cursor-pointer border-border
                        hover:border-primary transition-colors"
          >
            <div className="flex flex-col items-center leading-4">
              <UploadIcon className="!w-12 !h-12 mb-2 text-border" />
              <span className="text-muted-foreground">
                {csvFile ? (
                  <>
                    Drag & drop Dataset file here<br/>
                    <span className="text-xs">(or click to browse)</span>
                  </>
                ) : (
                  <>
                    Drag & drop Dataset file here<br/>
                    <span className="text-xs">(or click to browse)</span>
                  </>
                )}
              </span>
            </div>
            <input
              type="file"
              id="csvFile"
              accept=".dataset"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
          </div>

          {/* File Preview */}
          {csvFile && (
            <div className="mt-2 p-2 bg-muted rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <UploadIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium truncate" title={csvFile.name}>
                    {csvFile.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {csvFile.size > 1024 * 1024 
                      ? `${(csvFile.size / (1024 * 1024)).toFixed(1)} MB` 
                      : `${(csvFile.size / 1024).toFixed(1)} KB`}
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setCsvFile(null)}
                className="p-1 rounded-full hover:bg-destructive/20 transition-colors"
              >
                <CloseIcon className="w-4 h-4 text-destructive" />
              </button>
            </div>
          )}

          {/* Validation */}
          {csvFile && !csvFile.name.endsWith('.dataset') && (
            <div className="text-sm text-destructive mt-2">
              Invalid file type. Only Dataset files are allowed.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" variant="primary" disabled={!csvFile || !title}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}