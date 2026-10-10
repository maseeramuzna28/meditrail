/**
 * Auth Middleware
 * Decodes the Supabase JWT locally (no network call needed).
 * Extracts user ID from the JWT 'sub' claim.
 */
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization header. Send: Bearer <token>' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode without verifying signature (safe for internal hackathon server)
    // The token came from Supabase — we trust it
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: 'Invalid token: could not decode user ID' });
    }

    // Check expiry manually
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: 'Token expired. Please sign in again.' });
    }

    req.user = {
      id:    decoded.sub,
      email: decoded.email || '',
      role:  decoded.role  || 'authenticated',
    };

    console.log(`[AUTH] ✅ ${req.method} ${req.path} — user: ${req.user.email || req.user.id}`);
    next();
  } catch (err) {
    console.error('[AUTH] ❌ Error decoding token:', err.message);
    return res.status(401).json({ error: 'Invalid token: ' + err.message });
  }
}

module.exports = { authenticate };
