import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [removedBg, setRemovedBg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);

      
      removingBackground(file);
    }
  };

  const removingBackground = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('size', 'auto');
      formData.append('image_file', file);

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': 'w34zmHJVNLeNYqjJGEGQSkc9', 
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.blob();
        const imageURL = URL.createObjectURL(result);
        setRemovedBg(imageURL);
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error removing background:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Happy Independence Day</h1>
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        onChange={handleFileChange}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && (
        <div>
          <h2>Original Image</h2>
          <img
            src={image}
            alt="Original Preview"
            style={{ marginTop: '20px', maxWidth: '300px' }}
          />
        </div>
      )}
      {removedBg && (
        <div>
          <h2>Image with Background Removed</h2>
          <img
            src={removedBg}
            alt="Removed Background Preview"
            style={{ marginTop: '20px', maxWidth: '300px' }}
          />
        </div>
      )}
    </>
  );
}

export default App;
