import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileAudio, Play, X, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      
      const audioUrl = URL.createObjectURL(file);
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            filename: res.data.filename, 
            originalName: file.name,
            audioUrl: audioUrl 
          } 
        });
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Upload failed. Is the backend running?');
      setUploading(false);
      setProgress(0);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-brand-gray hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Upload Your Audio</h1>
          <p className="text-brand-gray text-lg">Supports MP3, MP4, WAV, M4A up to 100MB.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px]
                ${isDragActive ? 'border-brand-cyan bg-brand-cyan/5 glow-cyan' : 'border-white/20 hover:border-brand-purple hover:bg-white/5 hover:glow'}`}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 rounded-full bg-brand-dark flex items-center justify-center mb-6 shadow-xl">
                <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-brand-cyan' : 'text-brand-purple'}`} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Drag & drop your file here</h3>
              <p className="text-brand-gray mb-6">or <span className="text-brand-cyan">click to browse</span> from your computer</p>
              <div className="flex gap-2 text-xs font-medium text-brand-gray/60 uppercase tracking-wider">
                <span className="glass px-3 py-1 rounded-md">MP3</span>
                <span className="glass px-3 py-1 rounded-md">WAV</span>
                <span className="glass px-3 py-1 rounded-md">M4A</span>
                <span className="glass px-3 py-1 rounded-md">MP4</span>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-6 border-brand-purple/30 glow mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple to-brand-cyan flex items-center justify-center flex-shrink-0">
                      <FileAudio className="text-white w-6 h-6" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-lg truncate">{file.name}</h4>
                      <p className="text-sm text-brand-gray">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!uploading && (
                    <button onClick={removeFile} className="p-2 hover:bg-white/10 rounded-full transition-colors text-brand-gray hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="h-16 w-full glass rounded-xl flex items-center justify-center text-brand-gray text-sm mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                  <Play className="w-6 h-6 mr-3 opacity-50" />
                  Audio waveform preview ready
                </div>

                {uploading && (
                  <ProgressBar progress={progress} />
                )}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="mt-8 flex justify-end">
            <Button 
              variant="primary" 
              className="w-full md:w-auto text-lg px-10 py-4"
              disabled={!file || uploading}
              onClick={handleUpload}
            >
              {uploading ? 'Processing Audio...' : 'Analyze with AI →'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
