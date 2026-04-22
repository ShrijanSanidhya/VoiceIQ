import React, { useState } from 'react';
import { FileOutput } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from './Button';

const ExportButton = ({ filename, transcript, summary, sentiment, chapters, chatHistory }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!transcript) {
      toast.error('No transcript available to export!');
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading('Generating professional PDF report...');

    try {
      // Backend uses POST /export-pdf to accept massive payload lengths
      const response = await axios.post('http://localhost:8000/export-pdf', {
        filename: filename || 'audio_file',
        transcript: transcript,
        summary: summary || {},
        sentiment: sentiment || {},
        chapters: chapters || [],
        speakers: [], // Mocked for now, real app pulls from pyannote array
        chat_history: chatHistory || []
      }, { responseType: 'blob' }); // Important for receiving binary PDF file

      // Trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VoiceIQ_Report_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success('PDF Exported Successfully!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Check backend console.', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="primary" 
      onClick={handleExport} 
      isLoading={isExporting}
      className="flex items-center gap-2"
    >
      <FileOutput className="w-4 h-4" /> Export PDF
    </Button>
  );
};

export default ExportButton;
