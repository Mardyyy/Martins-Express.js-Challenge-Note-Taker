const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('./helpers/fsUtils');


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Wildcard route to direct users to a homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
});

// POST Route for submitting notes
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNotes = {
            title,
            text,
            title_id: uuidv4(),
        };

        readAndAppend(newNotes, './db/db.json');

        const response = {
            status: 'success',
            body: newNotes,
        };

        res.json(response);
    } else {
        res.json('Error in posting notes');
    }
});

// Listening
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);