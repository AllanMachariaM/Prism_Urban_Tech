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

// ✅ Only keep this one declaration of PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


// API Route to Fetch All Orders
app.get("/api/orders", (req, res) => {
    const query = "SELECT * FROM orders";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching orders:", err);
            return res.status(500).json({ error: "Database error." });
        }
        res.json(results); // Send all orders as a response
    });
});

// API Route to Update Order Status
app.put("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status is required." });
    }

    const query = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error("Error updating order status:", err);
            return res.status(500).json({ error: "Database error." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Order not found." });
        }
        res.json({ message: "Order status updated successfully!" });
    });
});

// API Route to Delete an Order
app.delete("/api/orders/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM orders WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting order:", err);
            return res.status(500).json({ error: "Database error." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Order not found." });
        }
        res.json({ message: "Order deleted successfully!" });
    });
});

