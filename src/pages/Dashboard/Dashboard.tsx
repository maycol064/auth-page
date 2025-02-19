import { NavLink } from 'react-router-dom';
import useAuthStore from '../../context/AuthStore';

export const Dashboard = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screenp-8">
      <div className="p-6 rounded-lg w-full max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">Dashboard</h2>

        {user && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold">User Information</h3>
            <p>Username: {user?.username}</p>
            <p>Email: {user.email}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            Multifactor Authentication (MFA)
          </h3>
          <p>
            {!user?.mfa_enabled
              ? 'To enhance the security of your account, we recommend activating MFA.'
              : 'Thank you for activate MFA'}
          </p>
          <NavLink to="/mfa_setup">
            <button
              className={`mt-4 w-full cursor-pointer ${
                user?.mfa_enabled ? 'bg-green-500' : 'bg-blue-500'
              } text-white py-2 rounded-lg font-semibold ${
                user?.mfa_enabled ? 'hover:bg-green-600' : 'hover:bg-blue-600'
              } focus:outline-none focus:ring-2`}
            >
              {user?.mfa_enabled ? 'Config' : 'Activate MFA'}
            </button>
          </NavLink>
          <button
            className="mt-4 w-full text-white py-2 rounded-lg font-semibold cursor-pointer hover:text-gray-500"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
