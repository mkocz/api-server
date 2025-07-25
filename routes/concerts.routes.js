const express = require('express');
const router = express.Router();
const db = require('../db');

router.route('/concerts').get((req, res) => {
    res.json(db.concerts);
});

module.exports = router;
