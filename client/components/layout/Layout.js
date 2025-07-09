import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, title = 'CoverMart - Premium iPhone Covers' }) => {
  // Add a noise texture overlay to enhance the black theme design
  useEffect(() => {
    // Create subtle noise pattern for enhanced visual depth
    const createNoisePattern = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const value = Math.floor(Math.random() * 255 * 0.05); // Very subtle noise
          data[i] = value;     // r
          data[i + 1] = value; // g
          data[i + 2] = value; // b
          data[i + 3] = 10;    // alpha (very transparent)
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Create a data URL from the canvas
        const dataURL = canvas.toDataURL('image/png');
        
        // Apply to the body as a background image
        document.body.style.backgroundImage = `url(${dataURL})`;
      }
    };
    
    createNoisePattern();
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Premium iPhone covers with world-class design" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white text-gray-800">
        <div className="fixed inset-0 bg-gradient-radial from-gray-50/20 to-white pointer-events-none z-0"></div>
        <Header />
        <main className="flex-grow relative z-10">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
