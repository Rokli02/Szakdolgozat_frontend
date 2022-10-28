import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

export const Logout = () => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout();
  }, [])

  return (
    <Navigate to="/login" />
  )
}