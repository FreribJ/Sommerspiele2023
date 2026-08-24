function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatDateNow() {
    return formatDate(new Date());
}

module.exports = function (app) {
    app.get('/checkLogin', function (req, res) {
        res.json({success: true, admin: req.session.admin, easterEggs: req.session.easterEggs}).end();
    });

    app.get('/team', function (req, res) {
        app.get('connection').query(
            `SELECT id, name, teampartner1 AS partner1, teampartner2 AS partner2, clique FROM team WHERE id = ?`,
            [req.session.id_team],
            function (err, rows) {
                if (err) return res.status(500).json(err).end();
                if (rows.length > 0) return res.json(rows[0]).end();
                res.status(404).json({message: 'Team not found'}).end();
            }
        );
    });

    app.get('/games', function (req, res) {
        app.get('connection').query('SELECT * FROM game', function (err, rows) {
            if (err) return res.status(500).json(err).end();
            res.json(rows).end();
        });
    });

    app.get('/activities', function (req, res) {
        const idTeam = req.session.id_team;
        const date = new Date();

        if (!req.query.since) {
            app.get('connection').query(
                `SELECT * FROM activity WHERE id_team1 = ? OR id_team2 = ? ORDER BY timestamp DESC`,
                [idTeam, idTeam],
                function (err, rows) {
                    if (err) return res.status(500).json(err).end();
                    res.json({lastUpdate: date.getTime(), activities: rows}).end();
                }
            );
        } else {
            const since = formatDate(new Date(parseInt(req.query.since, 10)));
            app.get('connection').query(
                `SELECT * FROM activity WHERE (id_team1 = ? OR id_team2 = ?) AND timestamp > ? ORDER BY timestamp DESC`,
                [idTeam, idTeam, since],
                function (err, rows) {
                    if (err) return res.status(500).json(err).end();
                    if (rows.length === 0) return res.status(204).end();
                    res.json({lastUpdate: date.getTime(), activities: rows}).end();
                }
            );
        }
    });

    app.post('/activity', function (req, res) {
        if (!app.get('acceptentries')) {
            return res.status(403).json({message: 'Entries are closed'}).end();
        }
        const id_game = parseInt(req.body.gameId, 10);
        const id_team1 = req.session.id_team;
        const id_team2 = parseInt(req.body.opponentId, 10);
        const id_winner = req.body.state === 'won' ? id_team1 : id_team2;

        if (isNaN(id_game) || isNaN(id_team2)) {
            return res.status(400).json({message: 'Invalid input'}).end();
        }

        app.get('connection').query(
            `INSERT INTO activity (id_game, id_team1, id_team2, id_winner, timestamp) VALUES (?, ?, ?, ?, ?)`,
            [id_game, id_team1, id_team2, id_winner, formatDateNow()],
            function (err, result) {
                if (err) return res.status(500).json(err).end();
                res.json(result).end();
            }
        );
    });

    app.put('/activity/:id', function (req, res) {
        if (!app.get('acceptentries')) {
            return res.status(403).json({message: 'Entries are closed'}).end();
        }
        const id = parseInt(req.params.id, 10);
        const id_winner = parseInt(req.body.winnerId, 10);
        const id_team = req.session.id_team;

        if (isNaN(id) || isNaN(id_winner)) {
            return res.status(400).json({message: 'Invalid input'}).end();
        }

        app.get('connection').query(
            `UPDATE activity SET id_winner = ?, timestamp = ?
             WHERE id = ? AND id_winner IS NULL AND plan = 1 AND (id_team1 = ? OR id_team2 = ?)`,
            [id_winner, formatDateNow(), id, id_team, id_team],
            function (err, result) {
                if (err) return res.status(500).json(err).end();
                if (result && result.affectedRows === 0) {
                    return res.status(409).json({message: 'Plan already filled out or not a plan at all'}).end();
                }
                res.json(result).end();
            }
        );
    });

    app.get('/guess', function (req, res) {
        app.get('connection').query(
            `SELECT guess FROM team WHERE id = ?`,
            [req.session.id_team],
            function (err, rows) {
                if (err) return res.status(500).json(err).end();
                if (rows.length > 0) return res.json(rows[0].guess).end();
                res.status(404).json({message: 'Team not found'}).end();
            }
        );
    });

    app.put('/guess', function (req, res) {
        if (!app.get('acceptentries')) {
            return res.status(403).json({message: 'Entries are closed'}).end();
        }
        const guess = parseInt(req.body.guess, 10);
        if (isNaN(guess)) {
            return res.status(400).json({message: 'Invalid input'}).end();
        }
        app.get('connection').query(
            `UPDATE team SET guess = ? WHERE id = ?`,
            [guess, req.session.id_team],
            function (err) {
                if (err) return res.status(500).json(err).end();
                res.json(guess).end();
            }
        );
    });

    app.get('/eastereggs', function (req, res) {
        app.get('connection').query(
            `SELECT id FROM easteregg WHERE id_team = ?`,
            [req.session.id_team],
            function (err, rows) {
                if (err) return res.status(500).json(err).end();
                res.json(rows).end();
            }
        );
    });

    app.post('/easteregg', function (req, res) {
        const id = parseInt(req.body.id, 10);
        const id_team = req.session.id_team;

        if (isNaN(id)) {
            return res.status(400).json({message: 'Invalid input'}).end();
        }

        app.get('connection').query(
            `INSERT INTO easteregg (id, id_team, timestamp) VALUES (?, ?, ?)`,
            [id, id_team, formatDateNow()],
            function (err, result) {
                if (err) {
                    if (err.errno === 1062) {
                        return res.status(409).json({message: 'EasterEgg already found'}).end();
                    }
                    return res.status(500).json(err).end();
                }
                res.json(result).end();
            }
        );
    });

    app.put('/team/update', function (req, res) {
        const teamname = req.body.updatedTeamName;
        const teammate1 = req.body.updatedTeamMate1;
        const teammate2 = req.body.updatedTeamMate2;

        if (typeof teamname !== 'string' || typeof teammate1 !== 'string' || typeof teammate2 !== 'string') {
            return res.status(400).json({message: 'Invalid input'}).end();
        }

        app.get('connection').query(
            `UPDATE team SET name = ?, teampartner1 = ?, teampartner2 = ? WHERE id = ?`,
            [teamname, teammate1, teammate2, req.session.id_team],
            function (err, result) {
                if (err) return res.status(500).json(err).end();
                res.json(result).end();
            }
        );
    });
};
