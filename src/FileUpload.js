import React, { useState } from 'react';
import { InsertDriveFile } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => setFile(acceptedFiles[0]),
    accept: '.txt,.docx,.pdf',
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      alert('Please choose a file to upload!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTestCases(response.data.test_cases);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
    }}>
      <div style={{
        width: '400px',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#333' }}>Upload & Generate</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Select a file and click generate to process
        </p>

        <div {...getRootProps()} style={{
          border: '2px dashed #ccc',
          borderRadius: '16px',
          padding: '40px 20px',
          cursor: 'pointer',
          background: '#f9fbfd',
        }}>
          <input {...getInputProps()} />
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <InsertDriveFile style={{ color: 'white', fontSize: 36 }} />
          </div>
          <Typography variant="body1" style={{ color: '#333' }}>
            {file ? file.name : 'Drag & Drop your file here or click to browse'}
          </Typography>
        </div>

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading}
          style={{
            marginTop: '30px',
            width: '100%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          {loading ? 'Processing...' : 'Generate'}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
