import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import ShareFile from './ShareFile';

function FileList({ user }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareModalFile, setShareModalFile] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Create a query to get user's files
    const q = query(
      collection(db, 'files'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const filesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFiles(filesList);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      return;
    }

    try {
  // Delete from Storage - prefer stored path when available; ref can take a path or URL
  const fileRef = ref(storage, file.path || file.url);
      await deleteObject(fileRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'files', file.id));
    } catch (err) {
      alert('Error deleting file: ' + err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="file-list-container">
        <h2>📋 My Files</h2>
        <div className="loading">Loading files...</div>
      </div>
    );
  }

  return (
    <div className="file-list-container">
      <h2>📋 My Files</h2>

      {error && <div className="error-message">{error}</div>}

      {files.length === 0 ? (
        <div className="empty-state">
          <p>No files uploaded yet. Upload your first file above!</p>
        </div>
      ) : (
        <div className="file-grid">
          {files.map((file) => (
            <div key={file.id} className="file-card">
              <div className="file-icon">
                {file.type?.startsWith('image/') ? '🖼️' : 
                 file.type?.startsWith('video/') ? '🎥' : 
                 file.type?.startsWith('audio/') ? '🎵' : 
                 file.type?.includes('pdf') ? '📕' : 
                 file.type?.includes('zip') ? '📦' : '📄'}
              </div>
              
              <div className="file-details">
                <h3 className="file-name" title={file.name}>{file.name}</h3>
                <p className="file-size">{formatFileSize(file.size)}</p>
                <p className="file-date">{formatDate(file.createdAt)}</p>
              </div>

              <div className="file-actions">
                <button
                  onClick={() => setShareModalFile(file)}
                  className="btn btn-small btn-share"
                  title="Share file"
                >
                  Share
                </button>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-small btn-primary"
                  download={file.name}
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(file)}
                  className="btn btn-small btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {shareModalFile && (
        <ShareFile
          file={shareModalFile}
          user={user}
          onClose={() => setShareModalFile(null)}
        />
      )}
    </div>
  );
}

export default FileList;
