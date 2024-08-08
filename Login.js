const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 7003;

app.use(express.json());
app.use(cors({
    origin: "https://darttgoblin.github.io",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://darttgoblin.github.io');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.removeHeader('Permissions-Policy');
    next();
});

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'sql7.freesqldatabase.com',
    user: 'sql7724126',
    password: 'V6PCDXyNdv',
    database: 'sql7724126'
});

app.post("/", (req, res) => {
    const usernameValue = req.body.usernameValue;
    const passwordValue = req.body.passwordValue;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection: ' + err.stack);
            res.status(500).json({ success: false, error: "Error connecting to the database" });
            return;
        }
        console.log('Connected to database with connection id ' + connection.threadId);

        connection.query('SELECT * FROM users WHERE username = ? AND passw = ?', [usernameValue, passwordValue], (error, results) => {
            connection.release();

            if (error) {
                console.error('Query error: ' + error.stack);
                res.status(500).json({ success: false, error: error.stack });
                return;
            }
            if (results.length > 0) {
                const userData = results[0];
                res.status(200).json({ success: true, userData });
            }
            else {res.status(200).json({ success: false, error: "No user has been found!" });}
        });
    });
});

app.listen(port, () => console.log("Listening on port " + port));
