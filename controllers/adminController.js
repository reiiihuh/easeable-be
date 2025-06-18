import bcrypt from 'bcrypt';
import { db } from '../models/db.js';
import jwt from 'jsonwebtoken';

export const registerAdmin = (req, res) => {
  const { nama, username, email, password } = req.body;

  if (!nama || !username || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO admin (nama, username, email, password)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nama, username, email, hashedPassword], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal mendaftarkan admin' });
    }

    res.json({ message: 'Admin berhasil didaftarkan' });
  });
};

export const loginAdmin = (req, res) => {
    const { username, password } = req.body;
  
    // // Validasi email
    // if (!email.endsWith('@student.telkomuniversity.ac.id')) {
    //   return res.status(400).json({ message: 'Gunakan email SSO Telkom University.' });
    // }
  
    const sql = 'SELECT * FROM admin WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
      if (err) return res.status(500).json({ error: err });
  
      if (result.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan.' });
  
      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ message: 'Password salah.' });
  
      const token = jwt.sign({ id_admin: user.id_admin, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
  
      res.json({ token, user: { id_admin: user.id_admin, name: user.nama, email: user.email } });
    });
};
