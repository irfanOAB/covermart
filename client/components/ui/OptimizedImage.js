import React, { useState } from 'react';
import Image from 'next/image';
import ImagePlaceholder from './ImagePlaceholder';

const OptimizedImage = ({ 
  src, 
  alt, 
  fill = false, 
  width = 400, 
  height = 400, 
  className = '', 
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  style = {},
  category,
  productName,
  ...props 
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Extract category from alt text if not provided
  const extractedCategory = category || (alt && alt.includes('for') ? 
    alt.split('for')[0].trim() : 
    (alt && alt.includes(' ') ? alt.split(' ')[0] : 'iPhone'));

  // Handle case when src is null or undefined
  if (!src) {
    return (
      <div className={`relative ${fill ? 'w-full h-full' : ''}`} style={fill ? { aspectRatio: '1/1', ...style } : style}>
        <div className="absolute inset-0">
          <ImagePlaceholder 
            category={extractedCategory} 
            text={productName || alt} 
            width={width} 
            height={height} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`} style={fill ? { aspectRatio: '1/1', ...style } : style}>
      {error ? (
        <div className="absolute inset-0">
          <ImagePlaceholder 
            category={extractedCategory} 
            text={productName || alt} 
            width={width} 
            height={height} 
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt || 'Product image'}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={`${className} ${!loaded ? 'opacity-0' : ''} transition-opacity duration-300`}
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          sizes={sizes}
          priority={priority}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
