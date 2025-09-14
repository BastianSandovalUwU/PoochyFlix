import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import Upload from './pages/Upload';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #141414;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
