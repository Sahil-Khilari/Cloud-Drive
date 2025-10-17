import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import Upload from './components/Upload';
import FileList from './components/FileList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>📁 File Share App</h1>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.email}</span>
              <button onClick={() => auth.signOut()} className="btn btn-secondary">
                Sign Out
              </button>
            </div>
          )}
        </header>

        <main className="app-main">
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Auth />} 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <div className="dashboard">
                    <Upload user={user} />
                    <FileList user={user} />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
