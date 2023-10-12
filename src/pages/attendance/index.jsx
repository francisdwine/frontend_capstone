import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import {
    selectedStyle,
    unselectedStyle,
    modalHeaderStyle,
    modalStyle,
    ButtonStyle1,
    ButtonStyle2,
    StyledInputBase,
  } from "./styles";
  

export default function Attendance(props) {
  const [attendance, setAttendance] = useState(false);
  const [id, setId] = useState(''); 
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);


  const openAttendanceModal = () => {
    setAttendance(true);
  };

  const closeModal = () => {
    setAttendance(false);
  };

  const openLogoutModal = () => {
    setLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setLogoutModalOpen(false);
  };

  const handleSave = () => {
    console.log('Logged in:', id);
    closeModal();
  };

  const handleLogout = () => {
    console.log('Logged out');
    closeLogoutModal();
  };

  return (
    <div>
        <div style={{ margin: '80px' }}></div>
      <Button variant="contained" sx={ButtonStyle1}
        onClick={openAttendanceModal}>
        Tap In
      </Button>
      <div style={{ margin: '20px' }}></div>
      <Button variant="contained" sx={ButtonStyle1}
        onClick={openLogoutModal}>
        Log Out
      </Button>

      <Modal
        open={attendance}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <h2 sx={{modalHeaderStyle}}>Tap In</h2>
          <Typography>Please input your ID number:</Typography>
          <div style={{ margin: '20px' }}></div>
          <TextField
            label="ID Number"
            variant="outlined"
            fullWidth
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
            <div style={{ margin: '20px' }}></div>
          <Button variant="contained" sx={ButtonStyle1} style={{ marginRight: '15px' }} onClick={handleSave}>
            Tap In
          </Button>
          <Button variant="contained" sx={ButtonStyle2} onClick={handleSave}>
            Cancel
          </Button>
        </Box>
      </Modal>

      <Modal
        open={isLogoutModalOpen}
        onClose={closeLogoutModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <h2 sx={{modalHeaderStyle}}>Are you sure you want to log out?</h2>
          <div style={{ margin: '20px' }}></div>
          <Button variant="contained" style={{ marginRight: '15px' }} sx={ButtonStyle1} onClick={handleLogout}>
            Yes
          </Button>
          <Button variant="contained" sx={ButtonStyle2} onClick={closeLogoutModal}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
