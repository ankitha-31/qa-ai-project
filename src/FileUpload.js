import React, { useState, useEffect } from 'react';
import { InsertDriveFile } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { Button, Typography, Snackbar, Alert, LinearProgress } from '@mui/material';
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonExiting, setButtonExiting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', 
  });

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      setErrorMessage('');
      setFile(acceptedFiles[0]);
      setDownloadUrl(null);
    },
    onDropRejected: () => {
      setErrorMessage('Only .pdf and .docx files are allowed.');
      setDownloadUrl(null);
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

    const validFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validFileTypes.includes(file.type)) {
      setErrorMessage('Only .pdf and .docx files are allowed.');
      setDownloadUrl(null);
      return;
    }

    setLoading(true);
    setDownloadUrl(null);
    setErrorMessage('');

    setTimeout(() => {
      const content = `This is generated content based on: ${file.name}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setLoading(false);
      setSnackbar({ open: true, message: 'File generated successfully!', severity: 'success' });
    }, 2000);
  };

  const handleDownload = () => {
    setButtonExiting(true);

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'generated-file.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadUrl(null);
      setFile(null);
      setButtonExiting(false);

      setSnackbar({ open: true, message: 'File downloaded successfully!', severity: 'success' });
    }, 400);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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

        {errorMessage && <div className="error-message">{errorMessage}</div>}

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
            <div className="generate-wrapper">
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={loading}
                className={`generate-button button-animate ${buttonExiting ? 'button-exit' : ''}`}
              >
                Generate
              </Button>
              {loading && (
  <LinearProgress
    className="progress-bar"
    sx={{
      width: '80%',
      height: 6,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // track background
      '& .MuiLinearProgress-bar': {
        background: 'linear-gradient(135deg, #c97c4a, #a35a2e)', // theme gradient
      },
    }}
  />
)}

            </div>
          )}

          {downloadUrl && (
            <Button
              variant="contained"
              onClick={handleDownload}
              disableElevation
              className={`generate-button button-animate ${buttonExiting ? 'button-exit' : ''}`}
            >
              Download File
            </Button>
          )}
        </div>
      </section>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default FileUpload;
