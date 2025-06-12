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