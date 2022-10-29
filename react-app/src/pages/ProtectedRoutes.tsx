import { useContext, FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { hasRight } from '../utils/auth-utils';

export const ProtectedRoutes: FC<{rights: string[]}> = ({ rights }) => {
  const { user } = useContext(AuthContext);

  return !hasRight(rights, user) 
    ? <Navigate to={"/login"} replace={true}/>
    : <Outlet />
}