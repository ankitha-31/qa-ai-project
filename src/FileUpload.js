import React, { useState, useEffect } from 'react';
import { InsertDriveFile } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { Button, Typography } from '@mui/material';
import './index.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-clear error message after 4 seconds
  useEffect(() => {
  if (errorMessage) {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 4000);

    return () => clearTimeout(timer);
  }
}, [errorMessage]);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop: acceptedFiles => {
    setErrorMessage(''); // Clear error message on new drop
    setFile(acceptedFiles[0]); // Update the file state
    setDownloadUrl(null); // Reset download URL when a new file is dropped
  },
  onDropRejected: () => {
    setErrorMessage('Only .pdf and .docx files are allowed.');
    setDownloadUrl(null); // Reset download URL if file is rejected
  },
  accept: {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  multiple: false,
});

const handleUpload = () => {
  if (!file) {
    setErrorMessage('Please choose a file to upload!');
    return;
  }

  // File type validation (PDF or DOCX)
  const validFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (!validFileTypes.includes(file.type)) {
    setErrorMessage('Only .pdf and .docx files are allowed.');
    setDownloadUrl(null);  // Reset download URL if file is invalid
    return;
  }

  setLoading(true);
  setDownloadUrl(null); // Clear any previous download URL
  setErrorMessage('');  // Clear error message if file is valid

  setTimeout(() => {
    const content = `This is generated content based on: ${file.name}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);  // Only set download URL after successful processing
    setLoading(false);
  }, 2000);
};



  return (
    <main className="upload-container">
      <section className="upload-box">
        <Typography variant="h4" className="title">
          Upload & Generate
        </Typography>
        <Typography variant="body1" className="subtitle">
          Select a file and click generate to process
        </Typography>

        {/* Error message display */}
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
          role="button"
          aria-label="File Upload Dropzone"
        >
          <input {...getInputProps()} />
          <div className="icon-wrapper">
            <InsertDriveFile className="file-icon" />
          </div>
          <Typography variant="body1" className="dropzone-text">
            {file ? file.name : 'Drag & Drop your file here or click to browse'}
          </Typography>
        </div>
        
        <div className="button-wrapper">
  {!downloadUrl && (
    <Button
      variant="contained"
      onClick={handleUpload}
      disabled={loading}
      className="generate-button"
      aria-label="Generate Button"
    >
      {loading ? (
        <div className="loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      ) : (
        'Generate'
      )}
    </Button>
  )}

  {downloadUrl && (
    <Button
      component="a"
      variant="contained"
      href={downloadUrl}
      download="generated-file.txt"
      disableElevation
      className="generate-button"
    >
      Download File
    </Button>
  )}
    </div>
  </section>
</main>
);
};
export default FileUpload;
