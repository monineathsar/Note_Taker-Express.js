// dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, "/db/db.json");

// to generate unique ID for each object
var uniqid = require('uniqid');

// express server & PORT
const app = express();

const PORT = 3001;

// data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// GET request to return notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Get request to return content from JSON file
app.get('/api/notes', (req, res) => {
    res.sendFile(dbFilePath);
});

// POST request for new notes
app.post('/api/notes', (req, res) => {
    res.json(`${req.method} request recieved to add a note`);
    if (req.body.title && req.body.text) {
        // grab existing notes
        fs.readFile(dbFilePath, 'utf-8', (err, data) => {
            let newNote = {
                title: req.body.title,
                text: req.body.text,
                // tags to each object in order to request DELETE 
                id: uniqid(),
            }
            if (err) {
                res.status(404).json('File not found');
            } else {
                // convert string into JSON object
                const parsedNote = JSON.parse(data);

                // adds the new note
                parsedNote.push(newNote);

                // writes new notes into db.json file
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
        res.status(200);
    } else {
        res.status(500).json('Error in posting note');
    }
}); 

// DELETE request of note
app.delete('/api/notes/:id', (req, res) => {
    res.json(`${req.method} request recieved to delete a note`);
    if (req.params.id) {
        //read notes from db.json
        const selectedId = req.params.id;
        fs.readFile(dbFilePath, 'utf-8', (err, data) => {
            if (err) {
                res.status(404).json('File not found');
            } else {
                // removes note using 'id' inside object array
                const deleteNote = JSON.parse(data).filter(item => item.id !== selectedId);
                // rewrite the updated notes list without the deleted note into the db.json file
                fs.writeFile(
                    dbFilePath,
                    JSON.stringify(deleteNote),
                    (writeErr) => 
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully delete the selected note!')
                );
            }
        });
        res.status(200);
    } else {
        res.status(404).json('Error in deleting note');
    }
});

// GETs index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

