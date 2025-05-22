import React, { useRef, useState, useEffect } from 'react';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ImageUpload = ({ onUpload, reset }) => {
  const [image, setImage] = useState(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (reset) {
      setImage(null);
      setCloudinaryUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  }, [reset]);

  const handleImageSelect = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    setImage({
      file,
      url: URL.createObjectURL(file),
    });

    const formData = new FormData();
    formData.append('my_file', file);

    try {
      setUploading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setCloudinaryUrl(data.result.secure_url);
        onUpload?.(data.result.secure_url);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Something went wrong during upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleImageDelete = () => {
    setImage(null);
    setCloudinaryUrl(null);
    fileInputRef.current.value = null;
    onUpload?.('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-gray-500 cursor-pointer transition duration-200 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="h-10 w-10 text-blue-400 mb-2" />
        <p className="font-semibold">
          {uploading ? 'Uploading...' : 'Click or drag image to upload'}
        </p>
      </div>

      {image && (
        <div className="mt-4 flex items-center space-x-4">
          <img src={image.url} alt="Preview" className="h-14 w-14 object-cover rounded" />
          <button
            onClick={handleImageDelete}
            className="flex items-center text-red-600 hover:text-red-800 font-semibold"
          >
            <XMarkIcon className="h-5 w-5 mr-1" />
            Remove
          </button>
        </div>
      )}

      {/* {cloudinaryUrl && (
        <p className="text-sm text-green-600 mt-2 break-all">Uploaded URL: {cloudinaryUrl}</p>
      )} */}
    </div>
  );
};

export default ImageUpload;
