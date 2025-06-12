import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"
  if (!token) return res.status(403).json({ message: 'Token tidak ditemukan.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token tidak valid.' });
    req.user = decoded;
    next();
  });
};