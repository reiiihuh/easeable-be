import { db } from '../models/db.js';
import cloudinary from '../config/cloudinary.js';

export const tambahRuteLengkap = async (req, res) => {
  try {
    const { nama_lokasi, deskripsi, info, langkahs } = JSON.parse(req.body.data);
    const placeholderFile = req.files?.['placeholder']?.[0];

    if (!placeholderFile) {
      return res.status(400).json({ message: 'Gambar placeholder tidak ditemukan' });
    }

    // Upload placeholder
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

    // Simpan lokasi
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

      // Validasi array file dan data langkah
      const gambarList = req.files?.['langkah_gambar'] || [];
      const gifList = req.files?.['langkah_gif'] || [];

      for (let i = 0; i < langkahs.length; i++) {
        const langkah = langkahs[i];
        const gambarFile = gambarList[i];

        if (!gambarFile) {
          console.warn(`Langkah ke-${i + 1} tidak memiliki gambar, dilewati.`);
          continue;
        }

        const url_gambar = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: `easeable/lokasi/${nama_lokasi}/langkah` },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          );
          stream.end(gambarFile.buffer);
        });

        let url_gif = null;
        const gifFile = gifList[i];
        if (gifFile) {
          url_gif = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: `easeable/lokasi/${nama_lokasi}/gif` },
              (err, result) => {
                if (err) reject(err);
                else resolve(result.secure_url);
              }
            );
            stream.end(gifFile.buffer);
          });
        }

        // Simpan langkah ke DB
        const ruteQuery = `
          INSERT INTO rute (id_lokasi, urutan_langkah, deskripsi_langkah, arah, url_gambar, url_gif)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const ruteValues = [
          id_lokasi,
          i + 1,
          langkah.deskripsi_langkah,
          langkah.arah,
          url_gambar,
          url_gif
        ];

        db.query(ruteQuery, ruteValues, (err) => {
          if (err) console.error(`Gagal insert langkah ke-${i + 1}:`, err);
        });
      }

      res.status(200).json({ message: 'Rute berhasil ditambahkan' });
    });
  } catch (err) {
    console.error('Kesalahan upload:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat upload rute' });
  }
};
