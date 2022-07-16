// dependencies
const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');

// express server & PORT
const app = express();

const PORT = 3001;

// data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notesData)
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

