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
  
  export const getAllFeedback = (req, res) => {
  const sql = `
    SELECT 
      f.id_feedback,
      f.jenis_laporan,
      f.deskripsi,
      f.tanggal,
      m.nama AS nama_mahasiswa,
      f.id_mahasiswa
    FROM feedback f
    JOIN mahasiswa m ON f.id_mahasiswa = m.id_mahasiswa
    ORDER BY f.tanggal DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Gagal mengambil feedback:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil feedback' });
    }

    res.json(results);
  });
};
