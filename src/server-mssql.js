const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
    user: "Nour",
    password: "Nour1234",
    server: "192.168.1.6", 
    database: "e_commerce",
    options: {
        encrypt: true, 
        trustServerCertificate: true, 
    },
};

app.post("/api/query", async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query(query);
        res.json(result.recordset || { message: "Query executed successfully" });
    } catch (err) {

        const errorDetails = {
            message: err.message, 
            code: err.code, 
        };

        res.status(500).json({ error: "SQL Error", details: errorDetails });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
