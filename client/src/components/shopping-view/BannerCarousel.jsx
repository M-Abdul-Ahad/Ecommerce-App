import React, { useState, useEffect } from 'react';

const BannerCarousel = () => {
  const banners = [1, 2, 3, 4, 5].map((num) => `/banners/banner${num}.webp`);
  const [current, setCurrent] = useState(0);

  const nextBanner = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextBanner();
    }, 4000);

    return () => clearInterval(interval);
  }, []); 

  return (
    <div style={{ position: 'relative', width: '100%', height: '550px', overflow: 'hidden' }}>
      <img
        src={banners[current]}
        alt={`Banner ${current + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <button
        onClick={prevBanner}
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.5)',
          border: 'none',
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        ◀
      </button>
      <button
        onClick={nextBanner}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.5)',
          border: 'none',
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        ▶
      </button>
    </div>
  );
};

export default BannerCarousel;
