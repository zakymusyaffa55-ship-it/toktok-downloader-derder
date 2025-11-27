// File: api/download.js
// Untuk Deployment Gratis di Vercel/Netlify

const axios = require('axios');

// API Publik Contoh (GANTI jika tidak berfungsi!)
// API publik scraping gratis ini sangat tidak stabil dan cepat rusak.
// Anda mungkin perlu mencari URL API publik lainnya jika ini gagal.
const TIKTOK_SCRAPER_API = 'https://www.tikwm.com/api/'; 

module.exports = async (req, res) => {
    // Hanya proses metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Hanya metode POST yang diizinkan.' });
    }

    const { videoUrl } = req.body;

    if (!videoUrl || !videoUrl.includes('tiktok.com')) {
        return res.status(400).json({ success: false, message: 'URL TikTok tidak valid.' });
    }

    try {
        // Kirim permintaan ke API scraping publik
        const response = await axios.post(TIKTOK_SCRAPER_API, new URLSearchParams({
            url: videoUrl,
            // Parameter lain yang mungkin dibutuhkan oleh API tertentu
        }));

        const data = response.data;

        // Cek jika API berhasil dan ada tautan unduhan tanpa watermark
        if (data.code === 0 && data.data && data.data.play) {
            
            // "play" biasanya adalah tautan tanpa watermark,
            // jika tidak berfungsi, coba "hdplay" atau properti lain yang dikembalikan oleh API
            const downloadLink = data.data.play; 
            
            return res.status(200).json({ 
                success: true, 
                downloadLink: downloadLink 
            });
            
        } else {
            return res.status(500).json({ 
                success: false, 
                message: data.msg || 'Gagal mendapatkan tautan video dari API publik.' 
            });
        }

    } catch (error) {
        console.error('Error saat memanggil API:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Kesalahan internal server atau API publik tidak merespons.' 
        });
    }
};