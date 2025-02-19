import { ReactNode } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login/Login';
import { Register } from '../pages/Register/Register';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { SetupMFA } from '../pages/SetupMFA/SetupMFA';
import useAuthStore from '../context/AuthStore';
import { MFAValidator } from '../pages/MFAValidator/MFAValidator';

export interface RouteType {
  path: string;
  component: ReactNode;
}

const publicRoutes: Array<RouteType> = [
  { path: '/', component: <Login /> },
  { path: '/register', component: <Register /> },
  { path: '/valid-mfa', component: <MFAValidator /> },
];

const privateRoutes: Array<RouteType> = [
  { path: '/dashboard', component: <Dashboard /> },
  { path: '/mfa_setup', component: <SetupMFA /> },
];

export const MainRouter = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {isAuthenticated
        ? privateRoutes.map((route) => (
            <Route
              path={route.path}
              element={route.component}
              key={route.path}
            />
          ))
        : publicRoutes.map((route) => (
            <Route
              path={route.path}
              element={route.component}
              key={route.path}
            />
          ))}

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} />}
      />
    </Routes>
  );
};
