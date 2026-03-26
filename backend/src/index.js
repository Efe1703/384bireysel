const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Veritabanı bağlantı ayarları (çevresel değişkenlerden çekiyoruz)
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Basit E-posta Doğrulama Regex'i
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. GET /api/people -> Tüm kişileri getir
app.get('/api/people', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM people ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// 2. GET /api/people/:id -> Tek kişi getir
app.get('/api/people/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM people WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// 3. POST /api/people -> Yeni kişi oluştur
app.post('/api/people', async (req, res) => {
    try {
        const { full_name, email } = req.body;
        
        // Boş alan kontrolü
        if (!full_name || !email) return res.status(400).json({ error: "Validation error: Missing fields" });
        
        // E-posta format kontrolü
        if (!emailRegex.test(email)) return res.status(400).json({ error: "Validation error: Invalid email format" });

        // E-posta daha önce kullanılmış mı kontrolü
        const emailCheck = await pool.query('SELECT * FROM people WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });

        const result = await pool.query(
            'INSERT INTO people (full_name, email) VALUES ($1, $2) RETURNING *',
            [full_name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// 4. PUT /api/people/:id -> Kişi güncelle
app.put('/api/people/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email } = req.body;

        if (!full_name || !email) return res.status(400).json({ error: "Validation error" });
        if (!emailRegex.test(email)) return res.status(400).json({ error: "Validation error" });

        // Kişi var mı kontrolü
        const userCheck = await pool.query('SELECT * FROM people WHERE id = $1', [id]);
        if (userCheck.rows.length === 0) return res.status(404).json({ error: "Not found" });

        // Güncellenmek istenen e-posta başkasına mı ait kontrolü
        const emailCheck = await pool.query('SELECT * FROM people WHERE email = $1 AND id != $2', [email, id]);
        if (emailCheck.rows.length > 0) return res.status(409).json({ error: "EMAIL_ALREADY_EXISTS" });

        const result = await pool.query(
            'UPDATE people SET full_name = $1, email = $2 WHERE id = $3 RETURNING *',
            [full_name, email, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// 5. DELETE /api/people/:id -> Kişi sil
app.delete('/api/people/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM people WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));