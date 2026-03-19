import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      ...(fullScreen && { height: '100vh' })
    }}>
      <CircularProgress size={60} thickness={4} />
      {message && (
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
      )}
    </Box>
  );

  return content;
};

export default LoadingSpinner;