import CryptoJS from 'crypto-js';

let userRequests = global.userRequests = global.userRequests || new Map();

export async function POST(req) {
  const { username } = await req.json();
  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400 });
  }
  const now = Date.now();
  // Clean up expired secure words
  for (const [user, data] of userRequests.entries()) {
    if (now - data.issuedAt > 60000) {
      userRequests.delete(user);
    }
  }
  const lastRequest = userRequests.get(username);
  if (lastRequest && now - lastRequest.issuedAt < 10000) {
    return new Response(JSON.stringify({ error: 'Wait 10 seconds before requesting again' }), { status: 429 });
  }
  const secureWord = CryptoJS.SHA256(username + now + 'secret').toString().substring(0, 8);
  userRequests.set(username, { secureWord, issuedAt: now });
  return new Response(JSON.stringify({ secureWord }), { status: 200 });
} 