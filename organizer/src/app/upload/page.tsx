'use client';

import { ChangeEvent, useState } from 'react';

function FileUpload() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        } else {
            setFile(null); // Clear the file state if no file is selected
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://127.0.0.1:3000/upload', {
                    method: 'POST',
                    body: formData, // no headers needed, browser sets Content-Type for FormData
                });
                if (response.ok) {
                  console.log(response);
                    const data = await response.json();
                    console.log('File uploaded successfully:', data);
                } else {
                    throw new Error(`Server responded with status ${response.status}`);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            console.error('No file selected');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    );
}

export default FileUpload;