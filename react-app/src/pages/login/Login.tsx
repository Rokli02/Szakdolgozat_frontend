import styles from './Login.module.css';
import * as yup from 'yup';
import { useContext, useState } from 'react';
import { LoginType } from '../../models/auth.model';
import { Button, TextField } from '@mui/material';
import { AuthContext } from '../../contexts/authContext';
import { ErrorMessage } from '../../models/menu.model';
import { useNavigate } from 'react-router-dom';
import { SnackbarContext } from '../../contexts/snackbarContext';

type LoginErrorMessage = {
  [key in keyof LoginType]: string;
}

export const Login = () => {
  const [state, setState] = useState<LoginType>({ login: undefined, password: undefined });
  const [errorMessage, setErrorMessage] = useState<LoginErrorMessage>({} as LoginErrorMessage);
  const { login } = useContext(AuthContext);
  const { setMessage } = useContext(SnackbarContext);
  const navigate = useNavigate();

  const submit = async (event: any) => {
    event.preventDefault();
    const errorMsg: LoginErrorMessage = {} as LoginErrorMessage;

    try {
      const result = await LoginSchema.validate(state, { abortEarly: false });
      const response = await login(result.login, result.password);
      navigate("/series");
      setMessage(response.message, "success");
      setErrorMessage(errorMsg);
    } catch(err) {
      if(err instanceof yup.ValidationError) {
        for(const error of err.inner) {
          errorMsg[(error.path as keyof LoginType)] = error.message;
        }
        setErrorMessage(errorMsg);
      } else {
        setMessage((err as ErrorMessage).message);
      }
    }
  }

  const handleChange = (event: any, fieldName: string) => {
    event.preventDefault();
    setState((pre) => ({
      ...pre,
      [fieldName]: event.target.value,
    }));
  }

  return (
    <div id={styles["login-container"]}>
      <div>
        <span className={styles["title"]}>Bejelentkezés</span>
      </div>
      <form onSubmit={submit} autoComplete='off' id={styles["login-form"]}>
        <div className={styles['form-field']}>
          <TextField className={styles['form-field-input']} label="Felhasználó / Email"
          error={errorMessage.login !== undefined} helperText={errorMessage.login}
          InputLabelProps={{ style:{transformOrigin: "50%" }}} onChange={(event) => handleChange(event, "login")} variant="standard"/>
        </div>
        <div className={styles['form-field']}>
          <TextField type="password" className={styles['form-field-input']} InputLabelProps={{ style:{transformOrigin: "50%" }}}
          error={errorMessage.password !== undefined} helperText={errorMessage.password}
          label="Jelszó" onChange={(event) => handleChange(event, "password")} variant="standard"/>
        </div>
        <Button type="submit" variant='contained'>Bejelentkezés</Button>
      </form>
    </div>
  )
}

const LoginSchema = yup.object().shape({
  login: yup.string().required("Felhasználónév, vagy email megadása kötelező!"),
  password: yup.string().required("Jelszó megadása kötelező!")
});