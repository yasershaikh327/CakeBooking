// src/pages/Home.js
import '../CSS/Home.css';
import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

function Home() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await axios.get('http://localhost:3001/api/products2?category=cake');
        setImages(response.data); // Assuming response.data is an array of product objects
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }
    fetchImages();
  }, []);

  return (
    <>
      <center>
        <h1 id="title">Welcome to CakeShop!</h1>
        <ImageList cols={3} rowHeight={164} class="image-group">
          {images.map((image, index) => (
            <ImageListItem key={image._id || index} class="image-slider">
              <img src={image.image} alt={image.name} loading="lazy" className='imgload'/>
            </ImageListItem>
          ))}
        </ImageList>
      </center>
    </>
  );
}

export default Home;
