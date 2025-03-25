// components/OptimizedImage.tsx
import React, { useState } from 'react';
import './OptimizedImage.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, width = 120, height = 120 }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className="image-container" style={{ width, height }}>
      {!isLoaded && !error && <div className="image-placeholder" />}
      <img 
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
        className={`pokemon-image ${isLoaded ? 'loaded' : 'loading'}`}
      />
      {error && <div className="image-fallback">?</div>}
    </div>
  );
};

export default OptimizedImage;