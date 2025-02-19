import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../context/AuthStore';
import { useLocation, useNavigate } from 'react-router-dom';

export const MFAValidator = () => {
  const { setAuthState, setUser } = useAuthStore();
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const validateCode = async (fullCode: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/verify_mfa/`,
        {
          user_id: state.user_id,
          token: fullCode,
        }
      );
      if (response.status === 200) {
        setIsValid(true);
        setError(null);
        setAuthState(true);
        delete state.message;
        setUser(response.data.user);
        navigate('/dashaboard');
      }
      return true;
    } catch (err) {
      setIsValid(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Error al verificar el código');
      } else {
        setError('Error al verificar el código');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit)) {
      validateCode(newCode.join(''));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter((char) => /^\d$/.test(char));

    const newCode = [...code];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });
    setCode(newCode);

    if (newCode.every((digit) => digit)) {
      validateCode(newCode.join(''));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Verificación MFA
        </h2>

        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-blue-500 focus:outline-none transition-colors
                ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}
              `}
              style={{
                borderColor:
                  isValid === null
                    ? '#e2e8f0'
                    : isValid
                    ? '#10b981'
                    : '#ef4444',
              }}
            />
          ))}
        </div>

        <div className="text-center">
          {isLoading && <div>Verificando...</div>}
          {!isLoading && isValid !== null && (
            <div
              className={`flex items-center justify-center gap-2 ${
                isValid ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {isValid ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Código válido</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5" />
                  <span>{error || 'Código inválido'}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
