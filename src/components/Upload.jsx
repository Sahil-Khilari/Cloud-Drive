import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase';

function Upload({ user }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (50MB limit)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setProgress(0);

    // Create a storage reference
    const storageRef = ref(storage, `files/${user.uid}/${Date.now()}_${file.name}`);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Track upload progress
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (err) => {
        setError(err.message);
        setUploading(false);
      },
      async () => {
        // Upload completed successfully
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Save file metadata to Firestore
          await addDoc(collection(db, 'files'), {
            name: file.name,
            url: downloadURL,
            path: uploadTask.snapshot.ref.fullPath,
            size: file.size,
            type: file.type,
            userId: user.uid,
            userEmail: user.email,
            createdAt: serverTimestamp(),
          });

          setSuccess('File uploaded successfully!');
          setFile(null);
          setProgress(0);
          // Reset file input
          document.getElementById('file-input').value = '';
        } catch (err) {
          setError(err.message);
        } finally {
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className="upload-container">
      <h2>📤 Upload File</h2>
      
      <div className="upload-card">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            disabled={uploading}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? `📄 ${file.name}` : '📁 Choose a file'}
          </label>
        </div>

        {file && (
          <div className="file-info">
            <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Type: {file.type || 'Unknown'}</p>
          </div>
        )}

        {uploading && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            >
              {Math.round(progress)}%
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn btn-primary"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  );
}

export default Upload;
