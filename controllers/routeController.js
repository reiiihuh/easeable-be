import { db } from '../models/db.js';
import cloudinary from '../config/cloudinary.js';

export const getSlidesByLocation = (req, res) => {
  const { location_name } = req.params;
  const sql = `
    SELECT 
      r.id_rute,
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

export const updateRute = async (req, res) => {
  const id_rute = req.params.id;
  const {
    deskripsi_langkah,
    arah,
    url_gambar,
    url_gif,
    urutan_langkah,
    nama_lokasi
  } = req.body;
  console.log('== UPDATE RUTE ==');
  console.log('params:', req.params);
  console.log('body:', req.body);
  console.log('files:', req.files);
  
  try {
    let finalUrlGambar = url_gambar || null;
    let finalUrlGif = url_gif || null;

    // === Upload gambar baru jika ada ===
    if (req.files?.['langkah_gambar']?.[0]) {
      const file = req.files['langkah_gambar'][0];
      finalUrlGambar = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `easeable/lokasi/${nama_lokasi}/langkah`,
            public_id: `langkah-${id_rute}`, // <= overwriting strategy
            overwrite: true
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    }

    // === Upload gif baru jika ada ===
    if (req.files?.['langkah_gif']?.[0]) {
      const file = req.files['langkah_gif'][0];
      finalUrlGif = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `easeable/lokasi/${nama_lokasi}/gif`,
            public_id: `gif-${id_rute}`,
            overwrite: true
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    }

    // === Update ke database ===
    const sql = `
      UPDATE rute 
      SET deskripsi_langkah = ?, arah = ?, url_gambar = ?, url_gif = ?, urutan_langkah = ?
      WHERE id_rute = ?
    `;
    const values = [
      deskripsi_langkah,
      arah,
      finalUrlGambar,
      finalUrlGif,
      urutan_langkah,
      id_rute
    ];

    db.query(sql, values, (err) => {
      if (err) {
        console.error('❌ Gagal update rute:', err);
        return res.status(500).json({ message: 'Gagal update rute', error: err });
      }
      res.status(200).json({ message: 'Langkah rute berhasil diperbarui' });
    });
  } catch (error) {
    console.error('❌ Error di updateRute:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat update rute' });
  }
};

export const deleteRute = (req, res) => {
  const id_rute = req.params.id;

  const selectSql = `SELECT url_gambar, url_gif FROM rute WHERE id_rute = ?`;

  db.query(selectSql, [id_rute], async (err, results) => {
    if (err) {
      console.error('❌ Gagal ambil data rute:', err);
      return res.status(500).json({ message: 'Gagal ambil data rute' });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Rute tidak ditemukan' });
    }

    const { url_gambar, url_gif } = results[0];

    // ✅ Fungsi aman untuk ambil public_id
    const extractPublicId = (url) => {
      if (!url) return null;
      const parts = url.split('/');
      const filename = parts.pop().split('.')[0]; // ambil nama file tanpa ekstensi
      const idxUpload = parts.indexOf('upload');
      // Lewati versi (v123456)
      const folderParts = parts.slice(idxUpload + 2);
      return `${folderParts.join('/')}/${filename}`;
    };

    const publicIdGambar = extractPublicId(url_gambar);
    const publicIdGif = extractPublicId(url_gif);

    console.log('🗑️ Hapus rute ID:', id_rute);
    console.log('Gambar Cloudinary:', publicIdGambar);
    console.log('GIF Cloudinary:', publicIdGif);

    try {
      if (publicIdGambar) {
        const delImg = await cloudinary.uploader.destroy(publicIdGambar);
        console.log('🧹 Gambar dihapus:', delImg.result);
      }
      if (publicIdGif) {
        const delGif = await cloudinary.uploader.destroy(publicIdGif);
        console.log('🧹 GIF dihapus:', delGif.result);
      }

      const deleteSql = `DELETE FROM rute WHERE id_rute = ?`;
      db.query(deleteSql, [id_rute], (err2) => {
        if (err2) {
          console.error('❌ Gagal hapus dari DB:', err2);
          return res.status(500).json({ message: 'Gagal hapus dari database' });
        }
        res.status(200).json({ message: 'Langkah rute berhasil dihapus' });
      });

    } catch (error) {
      console.error('❌ Gagal hapus dari Cloudinary:', error);
      res.status(500).json({ message: 'Gagal hapus gambar dari Cloudinary' });
    }
  });
};




