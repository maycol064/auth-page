import { ChangeEvent, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../context/AuthStore';

export const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setError(true);
    setError(false);
    const response = await login(username, password);
    if (!response)
      return alert(
        'Hubo un error, verifique sus credenciales o intente más tarde...'
      );
    if (response.requires_mfa)
      return navigate('/valid-mfa', { state: response });
    navigate('/dashboard');
  };

  useEffect(() => {
    if (!error) return;
    if (username && password) setError(false);
  }, [username, password, error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8">
        <h2 className="mb-6 text-center text-2xl font-bold">Iniciar Sesión</h2>
        {error && (
          <div className="mb-4 rounded-md bg-red-500 p-2 text-white text-center">
            Usuario y contraseña son requeridos
          </div>
        )}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            className="w-full rounded-md border p-2 focus:outline-none focus:ring-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-md border p-2 focus:outline-none focus:ring-2"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 cursor-pointer"
          >
            Ingresar
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <NavLink to="/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </NavLink>
        </p>
      </div>
    </div>
  );
};
