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
    <div style={{ padding: '24px 20px', border: '1.5px dashed #DDD6C8', borderRadius: '8px', textAlign: 'center', backgroundColor: '#FAF7F0' }}>
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
          backgroundColor: uploading ? '#A8A29E' : '#1C1C1A',
          color: '#FAF8F5',
          padding: '10px 22px',
          borderRadius: '6px',
          border: 'none',
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.08em',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 14px rgba(28, 28, 26, 0.12)'
        }}
      >
        {uploading ? 'UPLOADING...' : 'UPLOAD IMAGES'}
      </button>
      {error && <p style={{ color: '#DC2626', marginTop: '10px', fontSize: '12px', fontWeight: 600 }}>{error}</p>}
      <p style={{ color: '#68645C', marginTop: '10px', fontSize: '12px', letterSpacing: '0.02em' }}>Max file size: 5MB per image. Formats: JPG, PNG, WEBP.</p>
    </div>
  );
}
