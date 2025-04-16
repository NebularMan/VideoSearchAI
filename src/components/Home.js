import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Home.css';

function Home() {
  const [videoFile, setVideoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Clear preview and input on mount or refresh
    setVideoFile(null);
    setPreviewURL(null);
    setSearchText('');
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewURL(preview);
    } else {
      alert('Please upload a valid video file.');
    }
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (videoFile && searchText.trim() !== '') {
      // Create FormData to send video and text to Flask
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('searchText', searchText);

      // Send POST request to Flask backend
      try {
        const response = await fetch('/search_video', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          // Navigate to results page with data
          navigate('/results', { state: { videoUrl: previewURL, searchText, results: data.results } });
        } else {
          alert('No results found or error occurred.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error sending data to backend.');
      }
    } else {
      alert('Please upload a video and enter text to search.');
    }
  };

  return (
    <div className="home-container">
      <h1>SearchInVid</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="video/*" 
          onChange={handleFileChange} 
          required 
        />

        {/* Video Preview */}
        {previewURL && (
          <div style={{ marginTop: '20px' }}>
            <h3>Video Preview:</h3>
            <video 
              src={previewURL} 
              controls 
              width="600" 
              style={{ borderRadius: '10px' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Text input after video upload */}
        {videoFile && (
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="searchText">Enter text to search in the video:</label>
            <input
              type="text"
              id="searchText"
              value={searchText}
              onChange={handleSearchTextChange}
              placeholder="Enter search text"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
        )}

        <button type="submit" style={{ marginTop: '20px' }}>
          Search Video
        </button>
      </form>
    </div>
  );
}

export default Home;
