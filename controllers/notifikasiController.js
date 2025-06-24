import { db } from '../models/db.js';

export const submitResponFeedback = (req, res) => {
  const { id_feedback, id_admin, deskripsi } = req.body;

  if (!id_feedback || !id_admin || !deskripsi) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  const sql = `
    INSERT INTO notifikasi (id_feedback, id_admin, deskripsi, tanggal_respon)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(sql, [id_feedback, id_admin, deskripsi], (err, result) => {
    if (err) {
      console.error('Gagal menyimpan respon:', err);
      return res.status(500).json({ message: 'Gagal menyimpan respon feedback' });
    }

    res.status(201).json({ message: 'Respon berhasil dikirim!' });
  });
};

export const getNotifikasiByMahasiswa = (req, res) => {
  const { id_mahasiswa } = req.params;

  const sql = `
    SELECT 
      f.jenis_laporan,
      f.deskripsi AS deskripsi_feedback,
      n.deskripsi AS respon_admin,
      n.tanggal_respon,
      a.nama AS admin
    FROM notifikasi n
    JOIN feedback f ON n.id_feedback = f.id_feedback
    JOIN admin a ON n.id_admin = a.id_admin
    WHERE f.id_mahasiswa = ?
    ORDER BY n.tanggal_respon DESC
  `;

  db.query(sql, [id_mahasiswa], (err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil notifikasi', error: err });

    res.json(result);
  });
};

export const getNotifikasiByAdmin = (req, res) => {
  const { id_admin } = req.params;

  if (!id_admin) {
    return res.status(400).json({ message: 'ID admin tidak diberikan' });
  }

  const sql = `
SELECT 
  f.id_feedback,
  m.nama AS nama_mahasiswa,
  f.jenis_laporan,
  f.deskripsi AS deskripsi_feedback,
  f.tanggal AS tanggal_feedback,
  n.deskripsi AS respon_admin,
  n.tanggal_respon
FROM feedback f
JOIN mahasiswa m ON f.id_mahasiswa = m.id_mahasiswa
LEFT JOIN notifikasi n ON f.id_feedback = n.id_feedback
WHERE n.id_admin = ? OR n.id_admin IS NULL
ORDER BY f.tanggal DESC;

  `;

  db.query(sql, [id_admin], (err, result) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ message: 'Gagal mengambil notifikasi', error: err });
    }

    if (result.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(result);
  });
};
