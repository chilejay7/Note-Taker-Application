const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;

const util = require('util');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const db = require('./db/db.json');
// const { readFromFile } = require('./public/assets/js/write_read')

const reading = util.promisify(fs.readFile);
const writing = util.promisify(fs.writeFile);

// The contents of the database are read from the file.
// The database read is passed as the data to the .then and is parsed.
// The new object from the POST request is pushed to the existing array.
// The array again has to be stringified for storage in the database file.
// The new array is written back to the database.
const readFromFile = (fileName, note) => {
    return reading(fileName, 'utf8')
    .then((data) => {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(note);
        console.log(parsedNotes);
        const stringData = JSON.stringify(parsedNotes)
        console.log(stringData);
        return stringData;
    })
    .then((data) => {
        writing(fileName, data);
        console.log('Finished writing to the database.')
    })
}

app.use(express.static('public'));

// Middleware for parsing JSON and urlencoded form data.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// This route receives POST requests when the save button is used.
app.post('/api/notes', (req, res) => {

    // The title and text from the new note created are destructured from the request's body property.  They are used to create a new object.
    const { title, text } = req.body
    console.log(req.method);

    // A new objet is created using the properties from the request.  A uuid is added to each object for use in retrieval of the notes.
    const newNote = {
        title,
        text,
        id: uuid(),
    }

    if (!title || !text) {
        res.status(400);
        res.send('Please include a title and text content for your note.')
    } else {
        readFromFile ('./db/db.json', newNote);
        res.send('Your notes were saved to the database.');
    }
});

// The GET request initiated by clicking the Get Started button on the home page will provide the notes.html document.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
    
    console.info(req.method)
});

// This endpoint responds with the data needed by the menu at /notes to display existing notes.
app.get('/api/notes', (req, res) => {
    reading ('./db/db.json', 'utf8')
        .then((data) => {
            res.json(JSON.parse(data));
            // console.log(JSON.parse(data));
        })
})

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    findId = (note) => {
        return note.id === id;
    }

    reading('./db/db.json', 'utf8')
        .then((data) => {
            const parsedNotes = JSON.parse(data);
            const noteDelete = parsedNotes.find(findId);
            parsedNotes.splice(parsedNotes.indexOf(noteDelete), 1);
            console.log(parsedNotes);
            return (parsedNotes);
        })
        .then((data) => {
            writing('./db/db.json', JSON.stringify(data));
        })

    res.send('Note successfully removed from the database.')
});

// This route will return the user to the home page if they navigate to an endpoint that has not been defined.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// The listener starts the server and will use the port number defined within the PORT variable.
app.listen(PORT, () => {
    console.log(`Server listenting on Port: ${PORT}`)
});