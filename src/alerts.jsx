import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const alertStyles = {
  position: 'fixed',
  top: 570,
  left: 0,
  right: 0,
  width: '400px',
  zIndex: 1000, //para level sa modal not likod
};

export default function FilledAlerts({ variant, message }) {
  const renderAlert = () => {
    switch (variant) {
      case 'info':
        return (
          <Alert variant="filled" severity="info">
            {message}
          </Alert>
        );
      case 'success':
        return (
          <Alert variant="filled" severity="success">
            {message}
          </Alert>
        );
      // Add more cases as needed
      default:
        return null;
    }
  };

  return <div style={alertStyles}>{renderAlert()}</div>;
}
