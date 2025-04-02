import React from 'react';
import '../styles/components/loadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Carregando...</p>
    </div>
  );
};

export default LoadingSpinner;
