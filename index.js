const express = require("express");
const app = express();
const mysql = require("mysql");
const cor = require("cors");
const bcrypt = require("bcrypt");

const saltRound = 10;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
    session({
        key: "userId",
        secret: "rorkxdmsrj",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

app.use(
    cors({
        origin: [`http://localhost:${PORT}`],
        method: ["GET", "POST"],
        credentials: true,
    })
);

// DB connect
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "test",
});

connection.connect((error) => {
    if (error) throw error;
    else console.log("connect");
});

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
    res.send("hello world");
});

app.post("/api/auth/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRound, (err, hash) => {
        if (err) {
            console.log('err')
            res.send({
                status: 400
            })
        } else{
            connection.query(`INSERT INTO login (username, password) VALUES (?, ?)`)[
                (req.body.username, req.body.password)
            ],
                (error, results, fields) => {
                    if (error) {
                        throw error;
                        res.send({
                            status: 400,
                        });
                    } else {
                        res.send(results);
                        res.send({
                            status: 200,
                            results: results,
                        });
                    }
                };
        }
    
});

app.post("/api/auth/login", (req, res) => {
    })
    connection.query(`SELECT * FROM login WHERE username = ? AND password =?`)[
        (req.body.username, req.body.password)
    ],
        (error, results, fields) => {
            if (error) {
                res.send({
                    status: 400,
                });
            } else {
                if (results.length > 0) {
                    bcrypt.compare(
                        req.body.password,
                        results[0].password,
                        (err, respinse) => {
                            if (response) {
                                req.session.user = results[0];
                                console.log(req.session.user);
                                res.send({
                                    status: 200,
                                    data: results[0],
                                });
                            } else {
                                res.send({
                                    status: 400,
                                });
                            }
                        }
                    );
                    req.session.user = results;
                    res.send({
                        status: 200,
                        results: results,
                    });
                } else {
                    res.send({
                        status: 400,
                    });
                }
            }
        };
});

app.listen(PORT, () => {
    console.log("Server is running on port ${PORT}");
});
