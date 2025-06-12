import { db } from '../models/db.js';

export const getAllLocations = (req, res) => {
  const sql = `
    SELECT id_lokasi, nama_lokasi, deskripsi, info, url_placeholder
    FROM lokasi
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};