import React from 'react';
import Lottie from 'lottie-react';

const LottieAnimation = ({ 
  animationData, 
  width = '100%', 
  height = '100%', 
  loop = true, 
  autoplay = true,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`lottie-container ${className}`}
      style={{ 
        width, 
        height, 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style 
      }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieAnimation;
