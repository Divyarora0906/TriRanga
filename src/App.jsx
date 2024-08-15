import React, { useState } from 'react';
import bg from "./assets/jai-hind-sticker.gif";
import "./App.css";
import tri from "./assets/tri.png"
import logo from "./assets/TF.png"

function App() {
  const [image, setImage] = useState(null);
  const [removedBg, setRemovedBg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finalImage, setFinalImage] = useState(null);

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
        combineWithBG(imageURL);
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

  const combineWithBG = async (imageURL) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const gifBackground = new Image();
    gifBackground.src = bg;

    gifBackground.onload = () => {

      const img = new Image();
      img.src = imageURL;

      img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        ctx.drawImage(gifBackground, 0, 0, imgWidth, imgHeight);
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
        const finalImageURL = canvas.toDataURL('image/png');
        setFinalImage(finalImageURL);
      };
    };
  };

  return (
    <>
      <div className='Full_Container'>
        <img src={logo} alt="" style={{borderRadius:"200px",height:"100px",width:"100px"}}/>
        <h1 id='logo'>TriFusion</h1>
        <h1>Happy Independence Day </h1>
        <img src={tri} alt="" style={{ height: "40px", width: "55px" }} />

        <div className="file-upload-container">
          <label htmlFor="image" className="custom-file-upload">
            Choose File
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className='Flex'>
          {image && (
            <div>
              <h2>Original Image</h2>
              <img
                src={image}
                alt="Original Preview"
                style={{ marginTop: '20px', maxWidth: '300px', borderRadius: '20px' }}
              />
            </div>
          )}
          {finalImage && (
            <div>
              <h2>Add to Profile</h2>
              {loading && <p>Loading...</p>}
              <img
                src={finalImage}
                alt="Final Image with GIF Background"
                style={{ marginTop: '20px', maxWidth: '300px', borderRadius: '20px' }}
              />
            </div>
          )}

        </div>
        <a href={finalImage} download="DTiranga">
          <button className="download-btn">Download </button>
        </a>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <footer style={{ textAlign: 'center', fontSize: '18px' }}>
        © {new Date().getFullYear()} Developed and Concept by Divy Arora. All Rights Reserved.
      </footer>
    </>
  );
}

export default App;
