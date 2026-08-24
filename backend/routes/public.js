const crypto = require('crypto');
const config = require('../config');

function formatDateNow() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = function (app) {
    app.post('/login', function (req, res) {
        const id = parseInt(req.body.id, 10);
        const password = req.body.password;

        if (isNaN(id) || typeof password !== 'string') {
            return res.status(400).json({message: 'Invalid input'}).end();
        }

        app.get('connection').query(
            `SELECT id, CASE WHEN password = 'UNSET' THEN false ELSE true END AS passwordSet
             FROM team WHERE id = ? AND password IN (?, 'UNSET')`,
            [id, password],
            function (err, rows) {
                if (err) {
                    return res.status(500).json(err).end();
                }
                if (rows.length === 0) {
                    return res.status(401).json({message: 'incorrect password'}).end();
                }

                if (!rows[0].passwordSet) {
                    app.get('connection').query(
                        `UPDATE team SET password = ? WHERE id = ?`,
                        [password, id],
                        function (err) {
                            if (err) console.error('Failed to set password:', err);
                        }
                    );
                }

                const token = crypto.randomInt(1000000000000000);
                app.get('connection').query(
                    `INSERT INTO session (token, id_team, timestamp) VALUES (?, ?, ?)`,
                    [token, id, formatDateNow()],
                    function (err, result) {
                        if (err) {
                            return res.status(500).json(err).end();
                        }
                        res.cookie(config.cookieName, token, {expires: new Date(253402300000000)}).json({token: token});
                    }
                );
            }
        );
    });

    app.get('/teams', function (req, res) {
        app.get('connection').query(
            `SELECT id, name, teampartner1 AS partner1, teampartner2 AS partner2, clique,
                    CASE WHEN password = 'UNSET' THEN false ELSE true END AS passwordSet
             FROM team ORDER BY name`,
            function (err, rows) {
                if (err) {
                    return res.status(500).json(err).end();
                }
                res.json(rows).end();
            }
        );
    });
};
