import { Button, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { NewUser } from '../../models/user.model';
import * as yup from 'yup';
import styles from './Signup.module.css';
import { ErrorMessage } from '../../models/menu.model';
import { SnackbarContext } from '../../contexts/snackbarContext';
import { AuthContext } from '../../contexts/authContext';

type NewUserForm = {
  name?: string;
  birthdate?: string;
  username?: string;
  email?: string;
  password?: string;
  emailAgain?: string;
  passwordAgain?: string;
}

type NewUserErrorMessage = {
  [key in keyof NewUserForm]: string;
}

const initState: NewUserForm = {
  name: "",
  birthdate: "",
  username: "",
  email: "",
  emailAgain: "",
  password: "",
  passwordAgain: "",
}

export const Signup = () => {
  const [state, setState] = useState<NewUserForm>(initState);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<NewUserErrorMessage>({} as NewUserErrorMessage);
  const { setMessage } = useContext(SnackbarContext);
  const { signup } = useContext(AuthContext);

  const submit = async (e: any) => {
    e.preventDefault();
    const errorMsg: NewUserErrorMessage = {} as NewUserErrorMessage;
    try { 
      const result = await SignupSchema.validate(state, { abortEarly: false });

      delete result.emailAgain;
      delete result.passwordAgain;
      const newUser: NewUser = {
        ...result,
        birthdate: result.birthdate.toISOString().split("T")[0]
      };
      const response = await signup(newUser);

      resetState();
      setMessage(response.message, "success");
      setErrorMessage(errorMsg)
    } catch(err) {
      if(err instanceof yup.ValidationError) {
        for(const error of err.inner) {
          errorMsg[(error.path as keyof NewUserForm)] = error.message;
        }
        setErrorMessage(errorMsg)
      } else {
        setMessage((err as ErrorMessage).message);
      }
    }
  }

  const toggle = () => {
    setShowPassword((pre) => !pre);
  }

  const handleChange = (e: any, fieldName: string) => {
    setState((pre) => ({
      ...pre,
      [fieldName]: e.target.value
    }))
  }

  const resetState = () => {
    setState(initState);
  }

  return (
    <div id={styles["signup-container"]}>
      <div>
        <span className={styles["title"]}>Regisztráció</span>
      </div>
      <form onSubmit={submit} id={styles["signup-form"]}>
        <span className={styles["sub-title"]}>Személyes adatok</span>
        <div className={styles["form-row"]}>
          <div className={styles['form-field']}>
            <TextField className={styles['form-field-input']} InputLabelProps={{ style:{transformOrigin: "50%" }}} label="Név" 
                error={errorMessage.name !== undefined} helperText={errorMessage.name}
                onChange={(event) => handleChange(event, "name")} variant="standard" value={state.name}/>
          </div>
          <div className={styles['form-field']}>
            <TextField type={'date'} className={styles['form-field-input']} InputLabelProps={{ 
                style:{transformOrigin: "50%" }, shrink: true}} label="Születési dátum" 
                error={errorMessage.birthdate !== undefined} helperText={errorMessage.birthdate}
                onChange={(event) => handleChange(event, "birthdate")} variant="standard" value={state.birthdate}/>
          </div>
        </div>
        <span className={styles["sub-title"]}>Fiók adatok</span>
        <div className={styles["left-aligned-row"]}>
          <div className={styles['form-field']}>
            <TextField className={styles['form-field-input']} label="Felhasználónév" InputLabelProps={{ style:{transformOrigin: "50%" }}}
                error={errorMessage.username !== undefined} helperText={errorMessage.username}
                onChange={(event) => handleChange(event, "username")} variant="standard" value={state.username}/>
          </div>
        </div>
        <div className={styles["form-row"]}>
          <div className={styles['form-field']}>
            <TextField className={styles['form-field-input']} label="Email" InputLabelProps={{ style:{transformOrigin: "50%" }}}
                error={errorMessage.email !== undefined} helperText={errorMessage.email}
                onChange={(event) => handleChange(event, "email")} variant="standard" value={state.email}/>
          </div>
          <div className={styles['form-field']}>
            <TextField className={styles['form-field-input']} label="Email újra" InputLabelProps={{ style:{transformOrigin: "50%" }}}
                error={errorMessage.emailAgain !== undefined} helperText={errorMessage.emailAgain}
                onChange={(event) => handleChange(event, "emailAgain")} variant="standard" value={state.emailAgain}/>
          </div>
        </div>
        <div className={styles["form-row"]}>
        <div className={styles['form-field']}>
            <TextField type={showPassword ? 'text' : 'password'} className={styles['form-field-input']} label="Jelszó" 
                error={errorMessage.password !== undefined} helperText={errorMessage.password}
                InputLabelProps={{ style:{transformOrigin: "50%" }}} onChange={(event) => handleChange(event, "password")} variant="standard" value={state.password}/>
            
          </div>
          <div className={styles['form-field']}>
            <TextField type={showPassword ? 'text' : 'password'} className={styles['form-field-input']} label="Jelszó újra"
                error={errorMessage.passwordAgain !== undefined} helperText={errorMessage.passwordAgain}
                InputLabelProps={{ style:{transformOrigin: "50%" }}} onChange={(event) => handleChange(event, "passwordAgain")} variant="standard" value={state.passwordAgain}/>
          </div>
        </div>
        <div className={styles["show-password"]} onClick={toggle}>
          <input id={styles["show-password-button"]} type="checkbox" checked={showPassword} onChange={() => {}}/>
          <label id={styles["show-password-text"]}>Mutasd a jelszót!</label>
        </div>
        <div id={styles["form-button"]}>
          <Button type="submit" variant='contained'>Regisztráció</Button>
        </div>
      </form>
    </div>
  )
}

const SignupSchema = yup.object().shape({
  name: yup.string().required("Név megadása kötelező!"),
  birthdate: yup.date().required("Születési dátum megadása kötelező!").max(new Date(Date.now()), "A jelenlegi dátumnál nem lehet későbbi!"),
  username: yup.string().required("Felhasználónév megadása kötelező!"),
  email: yup.string().email("Valid emailnek kell lennie!").required("Email megadása kötelező!"),
  emailAgain: yup.string().email("Valid emailnek kell lennie!").test("Email egyezés", "Emailek nem egyeznek", function(value) {return !this.parent?.email || value === this.parent?.email}),
  password: yup.string().required("Jelszó megadása kötelező!"),
  passwordAgain: yup.string().test("Jelszó egyezés", "Jelszók nem egyeznek", function(value) {return !this.parent?.password || value === this.parent?.password})
});