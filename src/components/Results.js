import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Result.css';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { videoUrl, searchText, results } = location.state || {};
  const videoRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState(searchText || '');
  const [filteredResults, setFilteredResults] = useState(results || []);

  const handleSearch = () => {
    const lowerTerm = searchTerm.toLowerCase();
    const matches = results.filter(entry =>
      entry.text.toLowerCase().includes(lowerTerm)
    );
    setFilteredResults(matches);
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

      {/* Search input */}
      <div className="search-section" style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search within results..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {filteredResults.length > 0 ? (
        <>
          <p>Found <strong>{filteredResults.length}</strong> matches.</p>
          <div className="snapshot-grid">
            {filteredResults.map((result, index) => (
              <div key={index} className="snapshot-item" onClick={() => handleSeek(result.time)}>
                <img 
                  src={result.snapshot_url} 
                  alt={`Snapshot at ${result.time}s`} 
                  className="snapshot-img"
                />
                <div className="timestamp">{result.time}s</div>
                <div className="snapshot-text">{result.text}</div>
              </div>
            ))}
          </div>
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
