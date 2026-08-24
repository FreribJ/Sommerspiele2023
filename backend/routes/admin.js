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

module.exports = async function (app) {
    app.get('/admin/guess', function (req, res) {
        app.get('connection').query(`SELECT id AS id_team, guess FROM team`, function (err, rows) {
            if (err) return res.status(500).json(err).end();
            if (rows.length > 0) return res.json(rows).end();
            res.status(404).json({message: 'No Guess found'}).end();
        });
    });

    app.get('/admin/teams', function (req, res) {
        app.get('connection').query(
            `SELECT id, name, teampartner1 AS partner1, teampartner2 AS partner2, clique, password FROM team`,
            function (err, rows) {
                if (err) return res.status(500).json(err).end();
                res.json(rows).end();
            }
        );
    });

    app.get('/admin/eastereggs', function (req, res) {
        app.get('connection').query(`SELECT id, id_team FROM easteregg`, function (err, rows) {
            if (err) return res.status(500).json(err).end();
            res.json(rows).end();
        });
    });

    app.get('/admin/activities', function (req, res) {
        app.get('connection').query(`SELECT * FROM activity ORDER BY timestamp DESC`, function (err, rows) {
            if (err) return res.status(500).json(err).end();
            res.json(rows).end();
        });
    });

    app.get('/admin/activity/:id', function (req, res) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({message: 'Invalid id'}).end();

        app.get('connection').query(
            `SELECT * FROM activity WHERE id = ?`,
            [id],
            function (err, rows) {
                if (err) return res.status(500).json(err).end();
                if (rows.length > 0) return res.json(rows[0]).end();
                res.status(404).json({message: 'Activity not found'}).end();
            }
        );
    });

    app.put('/admin/activity/:id', function (req, res) {
        const id = parseInt(req.params.id, 10);
        const id_game = parseInt(req.body.gameId, 10);
        const id_team1 = parseInt(req.body.team1Id, 10);
        const id_team2 = parseInt(req.body.team2Id, 10);
        const id_winner = req.body.winnerId != null ? parseInt(req.body.winnerId, 10) : null;

        if (isNaN(id) || isNaN(id_game) || isNaN(id_team1) || isNaN(id_team2)) {
            return res.status(400).json({message: 'Invalid input'}).end();
        }

        const timestamp = id_winner == null ? null : formatDateNow();
        app.get('connection').query(
            `UPDATE activity SET id_game = ?, id_team1 = ?, id_team2 = ?, id_winner = ?, timestamp = ? WHERE id = ?`,
            [id_game, id_team1, id_team2, id_winner, timestamp, id],
            function (err, rows) {
                if (err) return res.status(500).json(err).end();
                res.json(rows).end();
            }
        );
    });

    app.delete('/admin/activity/:id', function (req, res) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({message: 'Invalid id'}).end();

        app.get('connection').query(
            `DELETE FROM activity WHERE id = ? AND plan = 0`,
            [id],
            function (err, rows) {
                if (err) return res.status(500).json(err).end();
                res.json(rows).end();
            }
        );
    });

    app.get('/admin/acceptentries', function (req, res) {
        res.json({acceptEntries: app.get('acceptentries')}).end();
    });

    app.put('/admin/acceptentries', function (req, res) {
        app.set('acceptentries', req.body.acceptEntries);
        res.json({acceptEntries: app.get('acceptentries')}).end();
    });
};
