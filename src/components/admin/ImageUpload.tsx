'use client';

import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  maxFiles?: number;
}

export default function ImageUpload({ onUploadSuccess, maxFiles = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        if (i >= maxFiles) break;
        
        const formData = new FormData();
        formData.append('file', files[i]);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        onUploadSuccess(data.url);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ padding: '16px', border: '2px dashed var(--linen)', borderRadius: '4px', textAlign: 'center' }}>
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        ref={fileInputRef}
      />
      <button 
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        style={{
          backgroundColor: 'var(--beige)',
          color: 'var(--espresso)',
          padding: '8px 16px',
          border: 'none',
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          letterSpacing: '0.1em'
        }}
      >
        {uploading ? 'UPLOADING...' : 'UPLOAD IMAGES'}
      </button>
      {error && <p style={{ color: 'var(--error)', marginTop: '8px', fontSize: '12px' }}>{error}</p>}
      <p style={{ color: 'var(--warm-grey)', marginTop: '8px', fontSize: '12px' }}>Max file size: 5MB. Formats: JPG, PNG, WEBP.</p>
    </div>
  );
}
