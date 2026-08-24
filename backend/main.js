const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const config = require('./config');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'database',
    user: 'user',
    password: 'oaiszdiufiansdfo',
    database: 'summergames',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

app.set('connection', pool);
app.set('acceptentries', false);

app.use(express.json());
app.use(cors({
    origin: config.allowedIp,
    credentials: true,
}));
app.use(cookieParser('summergames'));
app.use(sessionParser);

require('./routes/public')(app);
require('./routes/private')(app);
require('./routes/admin')(app);

app.listen(config.port, function () {
    console.log(`App started on port ${config.port}`);
});

async function sessionParser(req, res, next) {
    console.log('Request:', req.method, req.path);

    if (req.path === '/login' || req.path === '/teams') {
        return next();
    }

    const token = req.cookies[config.cookieName];
    if (!token) {
        return res.status(401).json({message: 'No Cookie set'}).end();
    }

    const tokenNum = parseInt(token, 10);
    if (isNaN(tokenNum)) {
        return res.status(401).json({message: 'Invalid token'}).end();
    }

    pool.query(
        `SELECT s.id_team, t.admin, COUNT(e.id) AS easterEggs
         FROM session s
         JOIN team t ON t.id = s.id_team
         LEFT JOIN easteregg e ON t.id = e.id_team
         WHERE s.token = ?
         GROUP BY s.id_team, t.admin`,
        [tokenNum],
        function (err, result) {
            if (err) {
                console.error('DB error in session parser:', err);
                return res.status(500).json(err).end();
            }
            if (result.length === 0) {
                return res.status(401).json({message: 'Token not found'}).end();
            }
            if (req.path.startsWith('/admin') && !result[0].admin) {
                return res.status(401).json({message: 'No admin privileges'}).end();
            }
            req.session = result[0];
            next();
        }
    );
}
