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

export const deleteLokasi = (req, res) => {
  const id_lokasi = req.params.id;

  const deleteRuteQuery = 'DELETE FROM rute WHERE id_lokasi = ?';
  const deleteLokasiQuery = 'DELETE FROM lokasi WHERE id_lokasi = ?';

  db.query(deleteRuteQuery, [id_lokasi], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menghapus rute' });

    db.query(deleteLokasiQuery, [id_lokasi], (err2) => {
      if (err2) return res.status(500).json({ message: 'Gagal menghapus lokasi' });
      res.status(200).json({ message: 'Lokasi dan semua rute berhasil dihapus' });
    });
  });
};

export const updateLokasi = (req, res) => {
  const { nama_lokasi, deskripsi, info } = req.body;
  const id_lokasi = req.params.id;

  const sql = `UPDATE lokasi SET nama_lokasi = ?, deskripsi = ?, info = ?, url_placeholder = ?, WHERE id_lokasi = ?`;
  db.query(sql, [nama_lokasi, deskripsi, info, url_placeholder, id_lokasi], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal update lokasi' });
    res.status(200).json({ message: 'Lokasi berhasil diperbarui' });
  });
};
