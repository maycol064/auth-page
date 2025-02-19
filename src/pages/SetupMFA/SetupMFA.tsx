import axios from 'axios';
import { useCallback, useState, useEffect } from 'react';
import useAuthStore, { User } from '../../context/AuthStore';
import QRCode from 'qrcode-generator';

// Types
interface MFAResponse {
  user: User;
  secret?: string;
  qr_uri?: string;
}

const API_BASE_URL = import.meta.env.VITE_URL;

export const SetupMFA = () => {
  const { token, setUser } = useAuthStore();
  const [mfaCode, setMfaCode] = useState('');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyAndEnable = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post<MFAResponse>(
        `${API_BASE_URL}/verify_and_enable_mfa/`,
        { secret, code: mfaCode },
        { headers: { Authorization: `Token ${token}` } }
      );

      setIsMfaEnabled(true);
      setMfaCode('');
      setUser(response.data.user);
    } catch (err) {
      setError('Failed to verify MFA code. Please try again.');
      console.error('MFA verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post<MFAResponse>(
        `${API_BASE_URL}/disable_mfa/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );

      setIsMfaEnabled(false);
      setUser(response.data.user);
      initiateMfaSetup(); // Refresh setup after disable
    } catch (err) {
      setError('Failed to disable MFA. Please try again.');
      console.error('MFA disable error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = (data: string) => {
    const qr = QRCode(0, 'L');
    qr.addData(data);
    qr.make();
    return qr.createDataURL(10, 10);
  };

  const initiateMfaSetup = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post<MFAResponse>(
        `${API_BASE_URL}/initiate_mfa_setup/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );

      setSecret(response.data.secret ?? '');

      if (response.data.qr_uri) {
        setQrCode(generateQRCode(response.data.qr_uri));
      }
    } catch (err: any) {
      if (err?.response?.data?.error === 'MFA ya está habilitado') {
        setIsMfaEnabled(true);
      } else {
        setError('Failed to initialize MFA setup. Please try again.');
        console.error('MFA setup error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    initiateMfaSetup();
  }, [initiateMfaSetup]);

  return (
    <div className="min-h-screen p-8">
      <div className="p-6 rounded-lg w-full max-w-xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-6">MFA Setup</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {isMfaEnabled ? (
          <>
            <div className="flex flex-col items-center justify-center text-center mb-10">
              <h3 className="text-xl font-semibold text-green-500">
                MFA is enabled
              </h3>
              <p className="mb-4">
                ¡Your account is more secure with MFA enabled! 🎉
              </p>
            </div>
            <button
              className="w-full border-2 border-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleDisable}
              disabled={isLoading}
            >
              {isLoading ? 'Disabling...' : 'Disable MFA'}
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center text-center mb-10">
              <h3 className="text-xl font-semibold">Scan the QR code</h3>
              <p className="mb-4">
                Use your authenticator app to scan the QR code below.
              </p>
              {qrCode && (
                <img
                  src={qrCode}
                  alt="QR Code"
                  width={250}
                  height={250}
                  className="border p-2 rounded-lg"
                />
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold">Enter MFA Code</h3>
              <div>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 6-digit MFA code"
                  maxLength={6}
                  disabled={isLoading}
                />

                <button
                  className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleVerifyAndEnable}
                  disabled={isLoading || mfaCode.length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
