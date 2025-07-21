import CryptoJS from 'crypto-js';

export async function POST(req) {
  const { username, hashedPassword, secureWord } = await req.json();

  // Mock user data
  const mockUser = {
    username: 'kamilamin',
    passwordHash: CryptoJS.SHA256('password123').toString(),
    // In a real app, secureWord would be checked against the in-memory store
  };

  if (!username || !hashedPassword || !secureWord) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  if (username !== mockUser.username || hashedPassword !== mockUser.passwordHash) {
    return new Response(JSON.stringify({ error: 'Invalid username or password' }), { status: 401 });
  }

  // Accept any secureWord for the mock
  return new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 });
} 