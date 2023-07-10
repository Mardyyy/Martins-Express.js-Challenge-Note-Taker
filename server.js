const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile} = require('./helpers/fsUtils');


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

// GET Route for retrieving all the notes
// app.get('/api/notes', (req, res) => {
//     readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
// });
// GET Route for retrieving all the notes
app.get('/api/notes', async(req, res) => {
    const data = await readFromFile('./db/db.json')
    res.json(JSON.parse(data))
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
            id: uuidv4(),
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

app.delete('/api/notes/:id', async(req, res) => {
    const id = req.params.id;
    console.log(id);
    const data = await readFromFile('./db/db.json')
    const json = await JSON.parse(data)
    const result = json.filter((note) => note.id !== id);
    console.log(result);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${id} has been deleted 🗑️`);

})

// Wildcard route to direct users to a homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Listening
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);