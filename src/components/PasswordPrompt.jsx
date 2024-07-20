import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const PasswordPrompt = ({ onPasswordCorrect, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (password === 'ddresearch') {
      onPasswordCorrect();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Admin Access</DialogTitle>
      <DialogContent>
        <Box component="form" display="flex" flexDirection="column" alignItems="center">
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordPrompt;
