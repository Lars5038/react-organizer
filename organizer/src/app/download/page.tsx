"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileDownloader = () => {
    const [imageSrc, setImageSrc] = useState(null);
  
    useEffect(() => {
      // Extract the file path from the URL query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const filePath = urlParams.get('filePath');
  
      if (filePath) {
        downloadFile(filePath);
      }
    }, []);
  
    const downloadFile = async (filePath) => {
      try {
        const response = await axios.get('http://localhost:3000/file', {
          headers: {
            'X-File-Path': filePath,
          },
          responseType: 'blob', // Handle the response as binary data
        });
  
        const mimeType = response.data.type;

        // Check if the MIME type is an image
      if (mimeType.startsWith('image/')) {
        // Create a URL for the image and set it as the image source
        const url = window.URL.createObjectURL(response.data);
        console.log(url)
        setImageSrc(url);  // No error, as imageSrc can be a string or null
      } else {
        // If it's not an image, download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filePath.split('/').pop() || 'downloaded_file');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading the file:', error.message);
    }
  };
  
    return (
      <div>
        <h1>File Downloader</h1>
        {imageSrc ? (
          <img src={imageSrc} alt="Downloaded" style={{ maxWidth: '100%', height: 'auto' }} />
        ) : (
          <p>If the file path is provided in the URL, the download should start automatically.</p>
        )}
      </div>
    );
  };
  

export default FileDownloader;
