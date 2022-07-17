// dependencies
const { Console } = require('console');
const { json } = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');
const notesData = require('./db/db.json');
const dbFilePath = path.join(__dirname, "/db/db.json");

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


// Get request to return conent from JSON file
app.get('/api/notes', (req, res) => {
    res.sendFile(dbFilePath);
});

// POST request for new notes
app.post('/api/notes', (req, res) => {
    res.json(`${req.method} request recieved to add a note`);
    let newNote = {
        title: req.body.title,
        text: req.body.text
    }
    
    if (newNote.title && newNote.text) {
        // grab existing reviews
        fs.readFile(dbFilePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(404).json('File not found');
            } else {
                // convert string into JSON object
                const parsedNote = JSON.parse(data);
                // adds the new note
                parsedNote.push(newNote);

                // writes new notes into the file
                fs.writeFile(
                    dbFilePath,
                    JSON.stringify(parsedNote),
                    (writeErr) => 
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
}); 



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

