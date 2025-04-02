require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection Using .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("✅ Connected to MySQL database.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// API Route to Handle Order Submission
app.post("/api/orders", (req, res) => {
    const { name, email, address, total, cart } = req.body;

    if (!name || !email || !address || !total || !cart) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = "INSERT INTO orders (name, email, address, total, cart) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [name, email, address, total, JSON.stringify(cart)], (err, result) => {
        if (err) {
            console.error("Order insert error:", err);
            return res.status(500).json({ error: "Database error." });
        }
        res.json({ success: true, message: "Order placed successfully!", orderId: result.insertId });
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
