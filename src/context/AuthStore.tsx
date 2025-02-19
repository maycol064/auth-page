import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  mfa_enabled: boolean;
  requires_mfa?: boolean;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  setUser: (user: User) => void;
  setAuthState: (isAuth: boolean) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (username: string, password: string) => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_URL}/login/`,
            {
              username,
              password,
            }
          );

          if (response.status !== 200) return null;

          const { user, token, requires_mfa } = response.data;

          if (requires_mfa) {
            set({ user, token, isAuthenticated: false });
            return response.data;
          }

          set({
            user,
            token,
            isAuthenticated: true,
          });

          return response.data;
        } catch (error) {
          console.error('Error en login:', error);
          return null;
        }
      },

      logout: async () => {
        try {
          const state = useAuthStore.getState();
          const response = await axios.post(
            `${import.meta.env.VITE_URL}/logout/`,
            { user: state.user },
            {
              headers: {
                Authorization: `Bearer ${state.token}`,
              },
            }
          );

          if (response.status === 200) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          console.error('Error en logout:', error);
          // Limpiar el estado incluso si hay error en el servidor
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      register: async (username: string, email: string, password: string) => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_URL}/register/`,
            {
              username,
              email,
              password,
            }
          );

          return response.status === 201;
        } catch (error) {
          console.error('Error en registro:', error);
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
              console.warn(
                'Datos inválidos en el registro:',
                error.response.data
              );
            } else {
              console.error(
                'Error en la petición:',
                error.response?.data || error.message
              );
            }
          } else {
            console.error('Error desconocido:', error);
          }
          return false;
        }
      },

      setUser: (user: User) =>
        set((state) => ({
          user: { ...state.user, ...user },
          isAuthenticated: true,
        })),

      setAuthState: (isAuth: boolean) =>
        set((state) => ({
          ...state,
          isAuthenticated: isAuth,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
