import { Button, FormControl, FormHelperText, Icon, IconButton, Input, InputAdornment, InputLabel, Switch, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DropdownBar } from '../../../components/items/drop-down-bar/DropdownBar';
import { SearchBar } from '../../../components/items/search-bar/SearchBar';
import { UserTable } from '../../../components/user-table/UserTable';
import { SnackbarContext } from '../../../contexts/snackbarContext';
import { DropdownItem } from '../../../models/menu.model';
import { NewUser, Role, User } from '../../../models/user.model';
import { deleteUserRequest, getRolesRequest, getUserRequest, updateUserRequest } from '../../../utils/user-utils';
import * as yup from 'yup';
import styles from './UserHandler.module.css';
import { Confirmation } from '../../../components/items/confirmation/Confirmation';

type UserFormState = {
  id?: number;
  name: string;
  email: string;
  birthdate: string;
  role: Role;
  password?: string;
  active: boolean;
}

type UserFormErrorMessage = {
  [key in keyof UserFormState]?: string;
}

export const UserHandler = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [searchValue, setSearchValue] = useState("");
  const [formState, setFormState] = useState<UserFormState>(formInit);
  const [errorMsg, setErrorMsg] = useState<UserFormErrorMessage>({});
  const [refreshToken, setRefreshToken] = useState(false);
  const [lockPassword, setLockPassword] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { setMessage } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await UserSchema.validate(formState, { abortEarly: false });

      if(response.active) {
        if(response.id) {
          const updatableUser: NewUser = { active: true } as NewUser;
          if(response.name !== selectedUser.name) {
            updatableUser.name = response.name;
          }
          if(response.birthdate.split("T")[0] !== selectedUser.birthdate.split("T")[0]) {
            updatableUser.birthdate = response.birthdate.split("T")[0];
          }
          if(response.email !== selectedUser.email) {
            updatableUser.email = response.email;
          }
          if(response.role.id !== selectedUser.role.id) {
            updatableUser.role = response.role;
          }
          if(response.password !== selectedUser.password && !lockPassword) {
            updatableUser.password = response.password;
          }

          const resp = await updateUserRequest(response.id, updatableUser);
          if(resp) {
            setMessage(resp, "success");
            setRefreshToken(pre => !pre);
            fetchUserData(response.id);
          }
        } else {
          setMessage("Valami hiba történt!");
          reset();
        }
      } else {
        if(response.active !== selectedUser.active) {
          setOpenConfirmation(true);
 
        } else {
          reset();
        }
      }
    } catch(err) {
      if(err instanceof yup.ValidationError) {
        for(const error of err.inner) {
          errorMsg[(error.path as keyof UserFormState)] = error.message;
        }
        setErrorMsg(errorMsg);
      } else {
        if((err as AxiosError).response.status === 401) {
          navigate("/logout");
        }
        setMessage((err as AxiosError<any>).response.data.message);
      }
    }

  }

  const setSearchValueWrapper = (searchValue: string) => {
    setSearchValue(searchValue);
  }
  const setSelectedUserId = (id: number) => {
    navigate(`/admin/user/${id}`, { replace: true });
  }

  const toggleLockPassword = () => {
    setLockPassword(pre => !pre)
  }
  const handleFormFieldChange = (e: any, fieldName: string) => {
    setFormState((pre) => ({
      ...pre,
      [fieldName]: e.target.value,
    }));
  }
  const handleActivation = () => {
    setFormState((pre) => ({
      ...pre,
      active: !pre.active,
    }));
    setLockPassword(true);
  }
  const closeConfirmation = () => {
    setOpenConfirmation(false);
  }
  const deactivateUser = async () => {
    const resp = await deleteUserRequest(userId);
    if(resp) {
      setMessage(resp, "success");
      reset();
    }
  }

  const setSelectedRole = (roleId: number) => {
    const role = roles.find((rl) => rl.id === roleId);
    if(role) {
      setFormState((pre) => ({
        ...pre,
        role: role
      }));
    }
  }
  const getRoleOptions = useCallback(() => {
    return roles.map((role) => ({ value: role.id, shownValue: role.name, highlight: role.id === formState.role.id }) as DropdownItem);
  }, [formState.role, roles])
  const fetchUserData = useCallback(async (userId: number) => {
    try {
      const response = await getUserRequest(userId);
      if(response) {
        setSelectedUser(response);
        setLockPassword(true);
        setFormState({
          id: response.id,
          name: response.name,
          email: response.email,
          birthdate: response.birthdate,
          role: response.role,
          password: "",
          active: response.active,
        })
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  const fetchRoleData = useCallback(async () => {
    try {
      const response = await getRolesRequest();
      if(response) {
        setRoles(response);
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    navigate("/admin/user");
    setUserId(undefined);
    setSelectedUser(undefined);
    setFormState(formInit);
    setErrorMsg({});
    setLockPassword(true);
    setRefreshToken((pre) => !pre);
  }

  useEffect(() => {
    fetchRoleData();
    if(!isNaN(Number(id))) {
      setUserId(Number(id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    if(userId) {
      fetchUserData(userId);
    }
  }, [fetchUserData, userId]);

  return (
    <div className={styles["container"]}>
      <Confirmation handleClose={closeConfirmation} open={openConfirmation} 
        question="Biztos deaktiválod a felhasználót?" onAccept={deactivateUser}
      />
      <div className={styles["sub-container"]}>
        <div className={styles["search-field"]}>
          <SearchBar setSearchValue={setSearchValueWrapper} />
        </div>
        <div className={styles["table"]}>
          <UserTable searchValue={searchValue} setSelectedUserId={setSelectedUserId} refreshToken={refreshToken} />
        </div>
      </div>
      {selectedUser &&
      <div className={styles["sub-container"]}>
        <div className={styles["header"]}>
          <h1>
            Felhasználó
          </h1>
          <div className={styles["id"]}>
            <label>ID: {selectedUser ? selectedUser.id : '?'}</label>
          </div>
        </div>
        <div className={styles["form-container"]}>
          <form onSubmit={submit}>
            <div className={styles['form-row']}>
              <div className={styles['form-col']}>
                <TextField label='Név' type='text' variant='standard' autoComplete='off' className={styles['form-col-input']}
                    value={formState.name} onChange={(e) => handleFormFieldChange(e, 'name')} InputLabelProps={{ style:{transformOrigin: "50%" }}}
                    error={errorMsg.name !== undefined} helperText={errorMsg.name} disabled={!formState.active}
                />
              </div>
              <div className={styles['form-col']}>
                <TextField label='Születési dátum' type='date' variant='standard' autoComplete='off' className={styles['form-col-input']}
                    value={formState.birthdate} onChange={(e) => handleFormFieldChange(e, 'birthdate')} InputLabelProps={{ style:{transformOrigin: "50%" }}}
                    error={errorMsg.birthdate !== undefined} helperText={errorMsg.birthdate} disabled={!formState.active}
                />
              </div>
            </div>
            <div className={styles['form-row']}>
              <div className={styles['form-col']}>
                <TextField label='Email' type='text' variant='standard' autoComplete='off' className={styles['form-col-input']}
                    value={formState.email} onChange={(e) => handleFormFieldChange(e, 'email')} InputLabelProps={{ style:{transformOrigin: "50%" }}}
                    error={errorMsg.email !== undefined} helperText={errorMsg.email} disabled={!formState.active}
                />
              </div>
              <div className={styles["form-col"]}>
                <DropdownBar
                    header='Szerepkör' options={getRoleOptions()} action={formState.active}
                    width='100%' changeHeader={false} setSelected={setSelectedRole}
                />
              </div>
            </div>
            <div className={styles['form-row']}>
            <div className={styles['form-col']}>
                <FormControl variant='standard' disabled={!formState.active || lockPassword} error={errorMsg.password !== undefined} className={styles['form-col-input']}> 
                  <InputLabel htmlFor='password-field' style={{transformOrigin: "50%"}}>Jelszó</InputLabel>
                  <Input id='password-field' type='text' autoComplete='off'
                      value={formState.password} onChange={(e) => handleFormFieldChange(e, 'password')}
                      endAdornment={
                        <InputAdornment position="end"  className={styles['lock-icon']}>
                          <IconButton
                            aria-label="Lock password"
                            onClick={toggleLockPassword}
                          >
                            <Icon>
                              { lockPassword ? 'lock' : 'lock_open'}
                            </Icon>
                          </IconButton>
                        </InputAdornment>
                      }
                  />
                  <FormHelperText>{errorMsg.password}</FormHelperText>
                </FormControl>
              </div>
            </div>
            <div className={styles["form-row"]}>
              <div className={styles["form-col form-footer"]}>
                {userId && <div></div>}
                <Button variant="contained" type="submit">Mentés</Button>
                {userId &&
                <>
                  <Switch checked={formState.active} onClick={handleActivation}/>
                  <span>{formState.active ? 'Aktiválva' : 'Deaktiválva'}</span>
                </>
                }
              </div>
            </div>
          </form>
        </div>
      </div>}
    </div>
  )
}

const UserSchema = yup.object().shape({
  id: yup.number().min(1),
  name: yup.string().required("A név megadása kötelező!"),
  email: yup.string().required("Az email megadása kötelező!").email("Valid email-nek kell lennie!"),
  birthdate: yup.string().required("A születési dátum megadása kötelező!"),
  role: yup.object({
    id: yup.number().min(1),
    name: yup.string()
  }),
  password: yup.string(),
  active: yup.boolean()
});

const formInit: UserFormState = {
  id: undefined,
  name: "",
  email: "",
  birthdate: "",
  password: "",
  role: {id: 0, name: 'unknown'},
  active: true,
}