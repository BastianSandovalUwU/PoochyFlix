import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import Upload from './pages/Upload';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isVideoPlayer = location.pathname.startsWith('/video/');

  return (
    <div className="min-h-screen bg-netflix-dark">
      {!isVideoPlayer && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:id" element={<VideoPlayer />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
