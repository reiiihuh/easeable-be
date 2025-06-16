import { db } from '../models/db.js';
import cloudinary from '../config/cloudinary.js';

export const tambahRuteLengkap = async (req, res) => {
  try {
    const { nama_lokasi, deskripsi, info, langkahs } = JSON.parse(req.body.data);
    const placeholderFile = req.files['placeholder']?.[0];

    // Upload placeholder ke folder lokasi
    const placeholderUrl = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `easeable/lokasi/${nama_lokasi}` },
        (err, result) => {
          if (err) reject(err);
          else resolve(result.secure_url);
        }
      );
      stream.end(placeholderFile.buffer);
    });

    // Simpan data lokasi ke DB
    const lokasiQuery = `
      INSERT INTO lokasi (nama_lokasi, deskripsi, info, url_placeholder)
      VALUES (?, ?, ?, ?)
    `;
    const lokasiValues = [nama_lokasi, deskripsi, info, placeholderUrl];

    db.query(lokasiQuery, lokasiValues, async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Gagal menyimpan lokasi' });
      }

      const id_lokasi = result.insertId;

      // Loop simpan langkah-langkah
      for (let i = 0; i < langkahs.length; i++) {
        const imgBuffer = req.files['langkah_gambar'][i].buffer;
        const gifBuffer = req.files['langkah_gif']?.[i]?.buffer;

        const [url_gambar, url_gif] = await Promise.all([
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: `easeable/lokasi/${nama_lokasi}/langkah` },
              (err, result) => {
                if (err) reject(err);
                else resolve(result.secure_url);
              }
            );
            stream.end(imgBuffer);
          }),
          gifBuffer
            ? new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: `easeable/lokasi/${nama_lokasi}/gif` },
                  (err, result) => {
                    if (err) reject(err);
                    else resolve(result.secure_url);
                  }
                );
                stream.end(gifBuffer);
              })
            : null
        ]);

        const ruteQuery = `
          INSERT INTO rute (id_lokasi, urutan_langkah, deskripsi_langkah, arah, url_gambar, url_gif)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const ruteValues = [
          id_lokasi,
          i + 1,
          langkahs[i].deskripsi_langkah,
          langkahs[i].arah,
          url_gambar,
          url_gif
        ];

        db.query(ruteQuery, ruteValues, (err) => {
          if (err) console.error('Gagal insert langkah ke DB:', err);
        });
      }

      res.status(200).json({ message: 'Rute berhasil ditambahkan' });
    });
  } catch (err) {
    console.error('Kesalahan upload:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat upload rute' });
  }
};
