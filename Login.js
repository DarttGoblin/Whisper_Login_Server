console.log("hi there im working!");

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
    res.header('Access-Control-Allow-Origin', 'https://darttgoblin.github.io');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.removeHeader('Permissions-Policy');
    next();
});

console.log("hi there im still working!");

app.post("/", (req, res) => {
    console.log("inside the app");
    const usernameValue = req.body.usernameValue;
    const passwordValue = req.body.passwordValue;
    var userData;

    const connection = mysql.createConnection({
        host: 'sql210.infinityfree.com',
        user: 'if0_37015726',
        password: 'Q8gUBnSRW3yloQZ',
        database: 'if0_37015726_whisper'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            resObject.error = "Error connecting to the database";
            res.status(500).json(resObject);
            return;
        }
        console.log('Connected to database with connection id ' + connection.threadId);

        connection.query('SELECT * FROM users WHERE username = ? AND passw = ?', [usernameValue, passwordValue], (error, results) => {
            if (error) {
                console.log('Error ' + error.stack);
                res.status(500).json({ success: false, error: error.stack });
                return;
            }
            if (results.length > 0) {
                userData = results[0];
                res.status(200).json({ success: true, userData });
            }
            else {res.status(200).json({ success: false, error: "No user has been found!" });}
        });
    });
});

app.listen(port, () => console.log("Listening on port " + port));
