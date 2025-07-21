"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MFA() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Try to get username from query or localStorage
    const userFromQuery = searchParams.get('username');
    if (userFromQuery) {
      setUsername(userFromQuery);
      localStorage.setItem('sessionUser', userFromQuery);
    } else {
      const userFromStorage = localStorage.getItem('sessionUser');
      if (userFromStorage) setUsername(userFromStorage);
    }
  }, [searchParams]);

  const handleVerify = async () => {
    if (!username) {
      setError('Username missing. Please login again.');
      return;
    }
    console.log({ username, code });
    const res = await fetch('/api/verifyMfa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, code }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
      localStorage.setItem('session', 'mock-jwt-token');
      setTimeout(() => {
        // Optionally clear navbar by setting a flag in localStorage
        localStorage.setItem('hideNavbar', 'true');
        router.push(`/dashboard`);
      }, 1000);
    } else {
      setError(data.error || 'Invalid MFA code');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">MFA Verification</h2>
        {success ? (
          <div className="text-green-600 text-center font-semibold">Login successful</div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2"
              placeholder="Enter 6-digit code"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleVerify}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Verify
            </button>
          </div>
        )}
      </div>
    </div>
  );
}