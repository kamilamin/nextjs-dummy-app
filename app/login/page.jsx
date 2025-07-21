"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';

export default function Login() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureWord, setSecureWord] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expiryTimer, setExpiryTimer] = useState(60);
  const router = useRouter();

  // Countdown for secure word expiration
  useEffect(() => {
    if (step === 2 && expiryTimer > 0) {
      const timer = setInterval(() => setExpiryTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, expiryTimer]);

  const handleUsernameSubmit = async () => {
    if (!username) {
      setError('Please enter your username');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/getSecureWord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (res.ok) {
        setSecureWord(data.secureWord);
        setStep(2);
        setExpiryTimer(60);
        setError('');
      } else {
        setError(data.error || 'Failed to get secure word');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setLoading(true);
    try {
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, hashedPassword, secureWord }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/mfa?username=${encodeURIComponent(username)}`);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">Multi-Step Login</h1>
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2"
              placeholder="Enter Username"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleUsernameSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Next'}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">Your Secure Word: <span className="font-semibold">{secureWord}</span></p>
              <p className="text-xs text-gray-500">Expires in {expiryTimer} seconds</p>
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            >
              Continue
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2"
              placeholder="Enter Password"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}