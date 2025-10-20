import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

function SharedFiles({ user }) {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'

  useEffect(() => {
    if (!user) return;

    const emailLower = user.email.trim().toLowerCase();
    const sharesRef = collection(db, 'shares');

    // Listen to received shares
    const unsubscribeReceived = onSnapshot(
      query(
        sharesRef,
        where('recipientEmailLower', '==', emailLower),
        orderBy('sharedAt', 'desc')
      ),
      (snapshot) => {
        const received = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSharedFiles((prev) => {
          // Keep sent files and merge received
          const sent = prev.filter((f) => f.ownerEmailLower === emailLower);
          return [...received, ...sent].sort((a, b) => (b.sharedAt?.seconds || 0) - (a.sharedAt?.seconds || 0));
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    // Listen to sent shares
    const unsubscribeSent = onSnapshot(
      query(
        sharesRef,
        where('ownerEmailLower', '==', emailLower),
        orderBy('sharedAt', 'desc')
      ),
      (snapshot) => {
        const sent = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSharedFiles((prev) => {
          const received = prev.filter((f) => f.recipientEmailLower === emailLower);
          return [...received, ...sent].sort((a, b) => (b.sharedAt?.seconds || 0) - (a.sharedAt?.seconds || 0));
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeReceived();
      unsubscribeSent();
    };
  }, [user]);

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

  const emailLower = user?.email?.trim().toLowerCase();
  const receivedFiles = sharedFiles.filter(
    (file) => file.recipientEmailLower === emailLower
  );

  const sentFiles = sharedFiles.filter(
    (file) => file.ownerEmailLower === emailLower
  );

  const displayFiles = activeTab === 'received' ? receivedFiles : sentFiles;

  if (loading) {
    return (
      <div className="shared-files-container">
        <h2>🔗 Shared Files</h2>
        <div className="loading">Loading shared files...</div>
      </div>
    );
  }

  return (
    <div className="shared-files-container">
      <h2>🔗 Shared Files</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          📥 Received ({receivedFiles.length})
        </button>
        <button
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          📤 Sent ({sentFiles.length})
        </button>
      </div>

      {displayFiles.length === 0 ? (
        <div className="empty-state">
          <p>
            {activeTab === 'received'
              ? 'No files have been shared with you yet.'
              : 'You haven\'t shared any files yet.'}
          </p>
        </div>
      ) : (
        <div className="file-grid">
          {displayFiles.map((file) => (
            <div key={file.id} className="file-card shared-file-card">
              <div className="file-icon">
                {file.fileType?.startsWith('image/') ? '🖼️' :
                 file.fileType?.startsWith('video/') ? '🎥' :
                 file.fileType?.startsWith('audio/') ? '🎵' :
                 file.fileType?.includes('pdf') ? '📕' :
                 file.fileType?.includes('zip') ? '📦' : '📄'}
              </div>

              <div className="file-details">
                <h3 className="file-name" title={file.fileName}>{file.fileName}</h3>
                <p className="file-size">{formatFileSize(file.fileSize)}</p>
                <p className="file-date">{formatDate(file.sharedAt)}</p>
                {activeTab === 'received' ? (
                  <p className="share-info">From: {file.ownerEmail}</p>
                ) : (
                  <p className="share-info">To: {file.recipientEmail}</p>
                )}
              </div>

              <div className="file-actions">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-small btn-primary"
                  download={file.fileName}
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SharedFiles;
