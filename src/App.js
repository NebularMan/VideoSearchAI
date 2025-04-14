// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Results from './components/Results';
import './App.css';

function App() {
  const [videoFile, setVideoFile] = useState(null);

  return (
    <Router>
      <header>
        <h1>SearchInVid</h1>
      </header>
      <Routes>
        <Route path="/" element={<Home setVideoFile={setVideoFile} />} />
        <Route path="/results" element={<Results videoFile={videoFile} />} />
      </Routes>
    </Router>
  );
}

export default App;
