import bcrypt from 'bcrypt';
import { db } from '../models/db.js';
import jwt from 'jsonwebtoken';

export const registerMahasiswa = async (req, res) => {
  const { nama, username, email, password } = req.body;

  // Validasi email SSO Telkom University
  if (!email.endsWith('@student.telkomuniversity.ac.id')) {
    return res.status(400).json({ message: 'Gunakan email SSO Telkom University.' });
  }

  // Cek apakah username atau email sudah ada
  const checkSql = 'SELECT * FROM mahasiswa WHERE username = ? OR email = ?';
  db.query(checkSql, [username, email], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error saat cek data' });
    if (result.length > 0) {
      return res.status(400).json({ message: 'Username atau Email sudah digunakan' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan ke database
    const insertSql = 'INSERT INTO mahasiswa (nama, username, email, password) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [nama, username, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Gagal mendaftarkan akun' });

      res.status(201).json({ message: 'Registrasi berhasil!' });
    });
  });
};

export const loginMahasiswa = (req, res) => {
    const { username, password } = req.body;
  
    // // Validasi email
    // if (!email.endsWith('@student.telkomuniversity.ac.id')) {
    //   return res.status(400).json({ message: 'Gunakan email SSO Telkom University.' });
    // }
  
    const sql = 'SELECT * FROM mahasiswa WHERE username = ?';
    db.query(sql, [username], async (err, result) => {
      if (err) return res.status(500).json({ error: err });
  
      if (result.length === 0) return res.status(401).json({ message: 'Username tidak ditemukan.' });
  
      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ message: 'Password salah.' });
  
      const token = jwt.sign({ id_mahasiswa: user.id_mahasiswa, role: 'mahasiswa' }, process.env.JWT_SECRET, { expiresIn: '2h' });
  
      res.json({ token, user: { id_mahasiswa: user.id_mahasiswa, name: user.nama, email: user.email } });
    });
  };
