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

router.route('/seats/:id').get((req, res) => {
    const id = req.params.id;

    if (id === 'random') {
        const id = Math.floor(Math.random() * db.seats.length)
        res.json(db.seats[id])
    } else {
        res.json(db.seats.filter(el => String(el.id) === id));
    }

});

router.route('/seats').post((req, res, next) => {
    const newEntry = {}
    newEntry.id = uuidv4()

    if (!req.body.author || !req.body.text) {
        return res.status(400).json({ message: 'Wrong data' });
    }

    newEntry.author = req.body.author
    newEntry.text = req.body.text
    db.seats.push(newEntry)

    saveDbToFile(db)
    res.json({ message: 'OK' })
})

router.route('/seats').put((req, res) => {
    const id = req.body.id
    const entry = db.seats.find(el => el.id === id)

    if (!entry) {
        return res.status(404).json({ message: 'Seat not found' });
    }

    entry.author = req.body.author
    entry.text = req.body.text

    saveDbToFile(db)
    res.json({ message: 'OK' })
})

router.route('/seats/:id').delete((req, res) => {
    const id = req.params.id;

    db.seats = db.seats.filter(el => String(el.id) !== id)
    saveDbToFile(db)

    res.json({ message: 'OK' })
})

module.exports = router;
