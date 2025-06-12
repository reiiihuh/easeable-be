import bcrypt from 'bcrypt';
import { db } from '../models/db.js';

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
