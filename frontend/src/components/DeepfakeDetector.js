import React, { useState } from 'react';

function DeepfakeDetector() {
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!file) {
      alert('Please select a video file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:8000/detect-deepfake/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Video processing failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Detection error', error);
      alert('Failed to process the video');
    }
    setUploading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deepfake Detection System</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <input 
            type="file" 
            accept="video/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {file && <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>}
        </div>
        
        <button 
          type="submit" 
          disabled={uploading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {uploading ? 'Processing...' : 'Detect Deepfake'}
        </button>
      </form>

      {uploading && (
        <div className="text-center mt-4 text-blue-500">
          Processing video... Please wait.
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 border rounded text-center">
          <h2 className={`text-xl font-bold ${result.overall_result ? 'text-red-600' : 'text-green-600'}`}>
            {result.overall_result ? 'Potential Deepfake Detected' : 'Genuine Video'}
          </h2>
          <p className="mt-2">
            Confidence: {result.confidence ? (result.confidence * 100).toFixed(2) + '%' : 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
}

export default DeepfakeDetector;