import * as React from 'react';
import { useContext } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AuthContext from '../auth'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
export default function AccountErrorModal(){
    const {auth} = useContext(AuthContext);
    let error = "";
    let isOpen = false;
    if (auth.errorMessage){
        error = auth.errorMessage;
        isOpen = true;
    }
    function handleCloseError(){
        auth.unmarkError();
    }
    return (
        <div>
        <Modal
          open={isOpen}
          onClose={handleCloseError}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error">{error}</Alert>
          </Stack>
          <Button id="dialog-ok-button"
            className =  "modal-button"
            onClick={handleCloseError}>
            OK
          </Button>
          </Box>
        </Modal>
      </div>
    );
}