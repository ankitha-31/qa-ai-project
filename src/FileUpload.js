import React, { useState } from 'react';
import { InsertDriveFile } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { Button, Typography, CircularProgress, LinearProgress } from '@mui/material';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => setFile(acceptedFiles[0]),
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  const handleUpload = () => {
    if (!file) {
      alert('Please choose a file to upload!');
      return;
    }

    setLoading(true);
    setDownloadUrl(null);

    setTimeout(() => {
      const content = `This is generated content based on: ${file.name}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      console.log('Generated download URL:', url);

      setDownloadUrl(url);
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

        {/* Dropzone area */}
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
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={loading}
            className="generate-button"
            aria-label="Generate Button"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate'}
          </Button>

          {loading && <LinearProgress style={{ marginTop: '20px', width: '100%' }} />}
        </div>

        {downloadUrl && (
          <div style={{ marginTop: '25px' }}>
            <Button
  component="a"
  variant="contained"
  href={downloadUrl}
  download="generated-file.txt"
  disableElevation
  className="generate-button"
  style={{ marginTop: '25px' }}
>
  Download File
</Button>


          </div>
        )}
      </section>
    </main>
  );
};

export default FileUpload;
