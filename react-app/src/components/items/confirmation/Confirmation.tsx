import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { AxiosError } from 'axios';
import { FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackbarContext } from '../../../contexts/snackbarContext';

type ConfirmationProps = {
  open: boolean;
  handleClose: () => void;
  question: string;
  onAccept: () => void;
}

export const Confirmation: FC<ConfirmationProps> = ({ open, handleClose, question, onAccept }) => {
  const navigate = useNavigate();
  const { setMessage } = useContext(SnackbarContext);

  const acceptHandle = () => {
    try {
      onAccept();
      handleClose();
    } catch(err) {
      if(err instanceof AxiosError) {
        if(err.response.status === 401) {
          navigate("/logout");
        }
        setMessage(err.response.data.message);
      }
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        {question}
      </DialogTitle>
      <DialogActions>
        <Button onClick={acceptHandle} variant="contained" color="error">Igen</Button>
        <Button onClick={handleClose} color="primary">Nem</Button>
      </DialogActions>
    </Dialog>
  )
}