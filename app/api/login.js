let userRequests = new Map();

// pages/api/login.js
export default function loginHandler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, hashedPassword, secureWord } = req.body;
  const record = userRequests.get(username);
  if (!record || record.secureWord !== secureWord || Date.now() - record.issuedAt > 60000) {
    return res.status(400).json({ error: 'Invalid or expired secure word' });
  }
  if (hashedPassword) {
    return res.status(200).json({ token: 'mock-jwt-token' });
  }
  res.status(400).json({ error: 'Login failed' });
}
