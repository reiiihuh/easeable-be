import { db } from '../models/db.js';

export const submitFeedback = (req, res) => {
  const { id_mahasiswa, jenis_laporan, deskripsi } = req.body;

  if (!id_mahasiswa || !jenis_laporan || !deskripsi) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }

  const sql = `INSERT INTO feedback (id_mahasiswa, jenis_laporan, deskripsi, tanggal) 
               VALUES (?, ?, ?, NOW())`;

  db.query(sql, [id_mahasiswa, jenis_laporan, deskripsi], (err, result) => {
    if (err) return res.status(500).json({ error: 'Gagal menyimpan feedback.' });
    res.json({ message: 'Feedback berhasil disimpan!' });
  });
};