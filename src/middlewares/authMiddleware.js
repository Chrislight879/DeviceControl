const sessions = require('../config/sessionStore');

function extractToken(headerValue = '') {
  if (!headerValue) {
    return null;
  }

  if (headerValue.startsWith('Bearer ')) {
    return headerValue.slice(7).trim();
  }

  return headerValue.trim();
}

module.exports = function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-auth-token'];
  const token = extractToken(authHeader);

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const user = sessions.get(token);

  if (!user) {
    return res.status(401).json({ message: 'Sesión inválida o expirada' });
  }

  req.user = user;
  req.authToken = token;
  next();
};