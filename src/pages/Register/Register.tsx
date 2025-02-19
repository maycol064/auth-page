import { redirect } from 'react-router-dom';
import useAuthStore from '../../context/AuthStore';
import { ChangeEvent, useEffect, useState } from 'react';

export const Register = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const { register, login } = useAuthStore();

  const handleRegister = async () => {
    if (!username || !password || !email) return setError(true);
    const response = await register(username, email, password);
    if (!response)
      return alert(
        'Error al registrar el usuario, verifique sus datos o intente más tarde...'
      );
    const onLogin = await login(username, password);
    if (!onLogin)
      return alert(
        'No se pudo iniciar sesión, verifique sus datos o intente más tarde...'
      );
    redirect('/dashboard');
  };

  useEffect(() => {
    if (!error) return;
    if (username && password && email) setError(false);
  }, [username, password, email, error]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {error && (
          <div className="mb-4 rounded-md bg-red-500 p-2 text-white text-center">
            Todos los campos son requeridos
          </div>
        )}
        <div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="Enter your username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold ">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="Enter your email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="Enter your password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 cursor-pointer"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};
