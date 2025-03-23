import React from 'react';

const Container = ({ children }) => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
      }}
    >
      {children}
    </div>
  );
};

export default Container;