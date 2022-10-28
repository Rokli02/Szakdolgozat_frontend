import { createContext, FC, useState } from 'react';
import { CustomSnackbar } from '../components/snackbar/CustomSnackbar';
import { SnackbarProps } from '../models/menu.model';



export const SnackbarContext = createContext({
  setMessage: (message: string, severity?: "success" | "error" ) => null,
});

export const SnackbarProvider: FC<{children: JSX.Element}> = ({ children }) => {
  const [props, setProps] = useState<SnackbarProps>({} as SnackbarProps);

  const setMessage = (message: string, severity: "success" | "error" = "error") => {
    setProps({
      message,
      severity
    });
    return null;
  }

  const handleClose = () => {
    setProps({} as SnackbarProps);
  }

  return (
    <SnackbarContext.Provider value={{
      setMessage
    }}>
      {children}
      { props.message && 
        <CustomSnackbar 
          message={props.message}
          severity={props.severity}
          handleClose={handleClose}
        />
      }
    </SnackbarContext.Provider>
  )
}