import { db } from '../models/db.js';
import cloudinary from '../config/cloudinary.js';

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


export const updateLokasi = async (req, res) => {

  try {
    // 🧠 CONTOH: kalau dikirim dari frontend pakai FormData, maka ini bentuknya string semua
const id_lokasi = req.params.id;
const { nama_lokasi, deskripsi, info, url_placeholder } = req.body;
 // Ambil dari route, bukan body
console.log('=== DEBUG BACKEND BODY ===');
console.log('params:', req.params);
console.log('body:', req.body);
console.log('files:', req.files);
console.log("DEBUG:", { id_lokasi, nama_lokasi, deskripsi, info, url_placeholder });


    // Ambil url lama dari body atau kosongkan
    let finalPlaceholderUrl = req.body.url_placeholder || '';

    // ✅ Kalau ada file baru, upload ke Cloudinary
    if (req.files && req.files['placeholder']) {
      const file = req.files['placeholder'][0];
      finalPlaceholderUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `easeable/lokasi/${nama_lokasi}` },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    }

    // ✅ Update lokasi ke DB
    const sql = `
      UPDATE lokasi 
      SET nama_lokasi = ?, deskripsi = ?, info = ?, url_placeholder = ?
      WHERE id_lokasi = ?
    `;
    const values = [nama_lokasi, deskripsi, info, finalPlaceholderUrl, id_lokasi];
    console.log("QUERY:", sql);
    console.log("VALUES:", values);
    
    db.query(sql, values, (err) => {
      if (err) {
        console.error('Gagal update lokasi:', err);
        return res.status(500).json({ message: 'Gagal update lokasi' });
      }

      return res.status(200).json({ message: 'Lokasi berhasil diperbarui' });
    });

  } catch (err) {
    console.error('Error di updateLokasi:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat update lokasi' });
  }
};
