import { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function ShareFile({ file, user, onClose }) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate Gmail
    if (!validateGmail(recipientEmail)) {
      setError('Please enter a valid Gmail address (e.g., user@gmail.com)');
      return;
    }

    // Check if sharing with self
    if (recipientEmail.trim().toLowerCase() === user.email.trim().toLowerCase()) {
      setError('You cannot share a file with yourself');
      return;
    }

    setLoading(true);

    try {
      // Check if already shared with this user
      const sharesRef = collection(db, 'shares');
      const q = query(
        sharesRef,
        where('fileId', '==', file.id),
        where('recipientEmailLower', '==', recipientEmail.trim().toLowerCase())
      );
      const existingShares = await getDocs(q);

      if (!existingShares.empty) {
        setError('File is already shared with this user');
        setLoading(false);
        return;
      }

      // Create share record
      await addDoc(collection(db, 'shares'), {
        fileId: file.id,
        fileName: file.name,
        fileUrl: file.url,
        fileSize: file.size,
        fileType: file.type,
        ownerId: user.uid,
        ownerEmail: user.email,
        ownerEmailLower: user.email.trim().toLowerCase(),
        recipientEmail: recipientEmail.trim(),
        recipientEmailLower: recipientEmail.trim().toLowerCase(),
        sharedAt: serverTimestamp(),
      });

      setSuccess(`File shared successfully with ${recipientEmail}`);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to share file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📤 Share File</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="file-info-box">
            <p><strong>File:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          <form onSubmit={handleShare}>
            <div className="form-group">
              <label htmlFor="recipientEmail">Recipient's Gmail Address</label>
              <input
                type="email"
                id="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="user@gmail.com"
                required
                disabled={loading}
                className="input-field"
              />
              <small className="input-hint">Only Gmail accounts are supported</small>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Sharing...' : 'Share File'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ShareFile;
