import jwt from 'jsonwebtoken';

export function rishAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.rsUser = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function rsRole(...allowed) {
  return (req, res, next) => {
    if (!req.rsUser || !allowed.includes(req.rsUser.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
