import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Result.css';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { videoUrl, searchText, results } = location.state || {};
  const videoRef = useRef(null);

  // States to hold the search term and results
  const [searchTerm, setSearchTerm] = useState(searchText || '');
  const [frequency, setFrequency] = useState(results.length);

  const handleSearch = () => {
    const lowerTerm = searchTerm.toLowerCase();
    const matches = results.filter(entry =>
      entry.text.toLowerCase().includes(lowerTerm)
    );
    setFrequency(matches.length);
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  return (
    <div className="results-container">
      <h2>Search Results for: <em>{searchTerm}</em></h2>

      {/* Video player */}
      <video ref={videoRef} controls src={videoUrl} className="video-player" />

      <div className="search-section" style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search within video..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {results.length > 0 ? (
        <>
          <p>Found <strong>{frequency}</strong> matches.</p>
          <ul className="search-results">
            {results.map((result, index) => (
              <li key={index} onClick={() => handleSeek(result.time)}>
                <strong>{result.time}s:</strong> {result.text}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No results found.</p>
      )}

      <button 
        onClick={() => navigate('/')} 
        style={{ marginTop: '30px' }}
      >
        ⬅️ Back to Home
      </button>
    </div>
  );
}

export default Results;
