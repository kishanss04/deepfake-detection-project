import React, { useState } from 'react';
import { Upload, RefreshCw, Check, AlertTriangle, Play, Pause } from 'lucide-react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setError(null);
      setVideoUrl(null);
      setPrediction(null);
    } else {
      setError('Please select a valid video file');
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a video file');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze video');
      }

      const result = await response.json();
      setPrediction(result.prediction);
      // Create a local URL for the uploaded file
      setVideoUrl(URL.createObjectURL(selectedFile));
    } catch (err) {
      setError('Error analyzing video: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    const video = document.getElementById('analysisVideo');
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative min-h-screen">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        src="/videos/background.mp4"
        autoPlay
        loop
        muted
      />

      <div className="relative z-10 min-h-screen bg-gradient-to-br from-[#0f2027]/60 via-[#203a43]/60 to-[#2c5364]/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-[#203a43]/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#2c5364]/40">
          <div className="text-center mb-12 space-y-4">
              <h1 className="deepfake-header text-6xl uppercase tracking-wider">
                Deepfake Detection
              </h1>
              <p className="text-gray-500 text-lg tracking-wider">
                Advanced AI-Powered Media Verification
              </p>
            </div>

            <div className="space-y-8">
              <div className="relative group">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="w-full h-32 opacity-0 absolute inset-0 cursor-pointer z-10"
                />
                <div className="h-32 border-2 border-dashed border-[#2c5364] rounded-xl flex items-center justify-center group-hover:border-blue-500 transition-colors duration-300">
                  <div className="text-center space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                    <span className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                      Drop your video here or click to browse
                    </span>
                  </div>
                </div>
              </div>

              {selectedFile && (
                <div className="px-4 py-3 bg-[#203a43] rounded-lg text-gray-300 flex items-center space-x-2">
                  <Check className="w-5 h-5 text-blue-500" />
                  <span>{selectedFile.name}</span>
                </div>
              )}

              {error && (
                <div className="px-4 py-3 bg-red-500/10 rounded-lg text-red-400 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || !selectedFile}
                className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transform transition-all duration-300 ease-out ${
                  isLoading || !selectedFile
                    ? 'bg-gray-800 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-red-600 to-red-800 hover:scale-105 hover:shadow-red-900/20'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    'Analyze Video'
                  )}
                </div>
              </button>

              {prediction && videoUrl && (
                <div className="mt-8 space-y-6">
                  <div className="relative rounded-xl overflow-hidden bg-black">
                    <video
                      id="analysisVideo"
                      src={videoUrl}
                      className="w-full rounded-xl"
                      autoPlay
                      loop
                      playsInline
                    />
                    <button
                      onClick={togglePlay}
                      className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>

                  <div
                    className={`transform transition-all duration-500 ease-out ${
                      prediction === 'real'
                        ? 'bg-green-500/20 border-green-500/30'
                        : 'bg-red-500/20 border-red-500/30'
                    } border rounded-xl p-6`}
                  >
                    <div className="text-center">
                      <h2 className={`text-3xl font-bold mb-2 ${
                        prediction === 'real' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {prediction === 'real' ? 'AUTHENTIC' : 'DEEPFAKE'}
                      </h2>
                      <p className="text-gray-400">
                        {prediction === 'real' 
                          ? 'This video appears to be authentic content ✓'
                          : 'This video appears to be artificially manipulated ⚠'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-[#203a43]/60 backdrop-blur-xl rounded-2xl p-6 border border-[#2c5364]/40">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">
                Built by <span className="text-blue-500">Moggers</span>
              </h3>
              <div className="flex justify-center space-x-4 text-gray-400">
                <span>• Kishan SS</span>
                <span>• Mohith S</span>
                <span>• Keerthan GV</span>
                <span>• Vishwajeet S</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}