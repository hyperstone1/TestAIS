import { Navigate } from 'react-router';

function PrivateRoute({ children }: any) {
  const isAuth = localStorage.getItem('id') ? true : false;

  return isAuth ? children : <Navigate to="/signin" />;
}
export default PrivateRoute;
