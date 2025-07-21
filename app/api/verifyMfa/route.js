import CryptoJS from 'crypto-js';

let mfaAttempts = {};
let userRequests = global.userRequests = global.userRequests || new Map();

export async function POST(req) {
  const { username, code } = await req.json();
  console.log(username, code);
  if (!username || !code) {
    return new Response(JSON.stringify({ error: 'Username and code are required' }), { status: 400 });
  }

  // Track attempts by username
  mfaAttempts[username] = mfaAttempts[username] || 0;
  if (mfaAttempts[username] >= 3) {
    return new Response(JSON.stringify({ error: 'Too many attempts. Locked out.' }), { status: 403 });
  }

  // Get the last generated code for the user
  const userData = userRequests.get(username);
  if (!userData || !userData.secureWord) {
    return new Response(JSON.stringify({ error: 'No secure word found for user. Please restart login.' }), { status: 400 });
  }
  const validCode = userData.secureWord;

  if (code === validCode) {
    mfaAttempts[username] = 0;
    return new Response(JSON.stringify({ message: 'MFA success' }), { status: 200 });
  } else {
    mfaAttempts[username] += 1;
    return new Response(JSON.stringify({ error: 'Invalid code' }), { status: 400 });
  }
} 