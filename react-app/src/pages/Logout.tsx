import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

export const Logout = () => {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Navigate to="/login" />
  )
}