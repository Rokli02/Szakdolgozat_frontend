import { Alert, Snackbar } from '@mui/material';
import { FC } from 'react';

export const CustomSnackbar: FC<{ message: string, severity?: "success" | "error", handleClose: () => void }> = ({ message, severity = "error", handleClose }) => {
  return (
    <Snackbar
      open={message !== undefined}
      autoHideDuration={5000}
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}