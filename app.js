const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

// API Key milikmu dari screenshot
const apiKey = "7kkBpCsRiyHvOVl9nxaS"; 

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) => {
    // Mengambil parameter 'q' dari URL
    const q = req.query.q || "Jakarta";
    
    // Menambahkan &language=id agar hasilnya dalam Bahasa Indonesia
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${apiKey}&language=id`;

    try {
        const response = await axios.get(url);
        const f = response.data.features[0];

        if (!f) {
            throw new Error("Lokasi tidak ditemukan");
        }

        // Fungsi pintar untuk mencari data di dalam properties atau context
        const cari = (tipeArray) => {
            // Gabungkan properti utama (f) dengan array context jika ada
            const semuaData = [f, ...(f.context || [])];
            
            // Cari data yang ID-nya diawali dengan salah satu tipe yang diminta
            const hasil = semuaData.find(x => 
                tipeArray.some(tipe => x.id && x.id.startsWith(tipe + "."))
            );
            
            // Jika ketemu, kembalikan text-nya. Jika tidak, kembalikan "-"
            return hasil ? hasil.text : "-";
        };

        res.json({
            lokasi: f.place_name || q,
            negara: cari(["country"]),
            provinsi: cari(["region", "state", "province", "county"]),
            kecamatan: cari(["municipality", "district", "locality"]),
            longitude: f.geometry.coordinates[0],
            latitude: f.geometry.coordinates[1]
        });
