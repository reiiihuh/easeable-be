import { db } from '../models/db.js';

export const getSlidesByLocation = (req, res) => {
  const { location_name } = req.params;
  const sql = `
    SELECT 
      l.nama_lokasi,
      r.urutan_langkah,
      r.url_gambar,
      r.url_gif,
      r.deskripsi_langkah,
      r.arah
    FROM rute r
    JOIN lokasi l ON r.id_lokasi = l.id_lokasi
    WHERE l.nama_lokasi = ?
    ORDER BY r.urutan_langkah ASC
  `;
  db.query(sql, [location_name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

export const updateRute = (req, res) => {
  const { deskripsi_langkah, arah, url_gambar, url_gif } = req.body;
  const id_rute = req.params.id;

  // Jika url_gif tidak dikirim, hanya update kolom lain
  let sql = '';
  let values = [];

  if (url_gif) {
    sql = `UPDATE rute SET deskripsi_langkah = ?, arah = ?, url_gambar = ?, url_gif = ? WHERE id_rute = ?`;
    values = [deskripsi_langkah, arah, url_gambar, url_gif, id_rute];
  } else {
    sql = `UPDATE rute SET deskripsi_langkah = ?, arah = ?, url_gambar = ? WHERE id_rute = ?`;
    values = [deskripsi_langkah, arah, url_gambar, id_rute];
  }

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal update rute', error: err });
    res.status(200).json({ message: 'Langkah rute berhasil diperbarui' });
  });
};

