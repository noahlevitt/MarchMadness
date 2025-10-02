import React from 'react';

const Toast = ({ message, isSuccess }) => {
    if (!message) return null;

    const style = {
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '12px 20px',
        borderRadius: '8px',
        backgroundColor: isSuccess ? '#4CAF50' : '#f44336',
        color: 'white',
        zIndex: 1001,
    };

    return <div style={style}>{message}</div>;
};

export default Toast;