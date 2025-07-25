const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

function saveDbToFile(dbObject) {
    const dbPath = path.join(__dirname, '../db');
    const content = 'const db = ' + util.inspect(dbObject, { depth: null, compact: false }) + ';\n\nmodule.exports = db;\n';
    fs.writeFileSync(dbPath, content, 'utf-8');
}

router.route('/seats').get((req, res) => {
    res.json(db.seats);
});

router.route('/seats').post((req, res) => {
    const newEntry = {}
    newEntry.id = uuidv4()

    if (!req.body.seat || !req.body.client || !req.body.email || !req.body.day) {
        return res.status(400).json({ message: 'Wrong data' });
    }

    if (db.seats.find(el => el.seat === req.body.seat)) {
        return res.status(400).json({ message: "The slot is already taken..." });
    }

    newEntry.seat = req.body.seat
    newEntry.client = req.body.client
    newEntry.day = req.body.day
    newEntry.email = req.body.email
    db.seats.push(newEntry)

    saveDbToFile(db)
    res.json({ message: 'OK' })
})

module.exports = router;
