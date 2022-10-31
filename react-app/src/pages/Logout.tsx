import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';

export const Logout = () => {
  const { logout } = useContext(AuthContext);
  logout();

  return (
    <div>logout</div>
  )
}