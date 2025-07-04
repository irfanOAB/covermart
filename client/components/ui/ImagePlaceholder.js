import React from 'react';

const ImagePlaceholder = ({ category, width = 400, height = 400, text }) => {
  // Generate a color based on the category
  const getColorForCategory = (category) => {
    const colors = {
      'Silicone': '#3B82F6', // blue
      'Leather': '#8B4513',  // brown
      'Transparent': '#6B7280', // gray
      'Designer': '#EC4899',  // pink
      'default': '#1F2937'  // dark gray
    };
    
    return colors[category] || colors.default;
  };
  
  const bgColor = getColorForCategory(category);
  const displayText = text || `${category || 'iPhone'} Cover`;
  
  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'sans-serif',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Pattern overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
          backgroundSize: '100px 100px',
        }}
      />
      
      {/* iPhone outline */}
      <div 
        style={{
          width: '60%',
          height: '70%',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '24px',
          marginBottom: '1rem',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Notch */}
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            width: '40%',
            height: '15px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: '0 0 10px 10px'
          }}
        />
        
        {/* Camera */}
        <div 
          style={{
            position: 'absolute',
            top: '40px',
            right: '30%',
            width: '20px',
            height: '20px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: '50%'
          }}
        />
      </div>
      
      <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{displayText}</div>
      <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Image Placeholder</div>
    </div>
  );
};

export default ImagePlaceholder;
