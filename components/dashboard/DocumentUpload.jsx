'use client';
import { useState, useEffect } from 'react';

export default function DocumentUpload() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
    setMessage('');
    setProgress(0);
  };

  const handleUpload = () => {
    if (!selectedFiles) return;
    setUploading(true);
    setMessage('');

    // Simulate upload progress using setInterval
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setMessage('Upload successful!');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Clean up any ongoing upload simulation when the component unmounts
  useEffect(() => {
    return () => {
      setUploading(false);
    };
  }, []);

  return (
    <div className="max-w mx-auto p-6 bg-white shadow-md rounded-lg m-3">
      <h3 className="text-2xl font-bold mb-4 text-center">Upload Documents</h3>

      {/* File Input */}
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />

      {/* Preview of Selected Files */}
      {selectedFiles && (
        <div className="mb-4">
          <p className="text-lg font-medium">
            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}{' '}
            selected:
          </p>
          <ul className="list-disc pl-6">
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index} className="text-gray-600">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Simulated Upload Progress */}
      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-blue-600 font-semibold">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {/* Upload Status Message */}
      {message && !uploading && (
        <div className="mb-4">
          <p className="text-green-600 font-semibold">{message}</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || !selectedFiles}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
