const express = require('express');
const router = express.Router();
const fs = require('fs');
const util = require('util');
const { v4: uuid } = require('uuid');

const reading = util.promisify(fs.readFile);
const writing = util.promisify(fs.writeFile);

router.use(express.json());
router.use(express.urlencoded({extended: true}));

// The contents of the database are read from the file.
// The database read is passed as the data to the .then and is parsed.
// The new object from the POST request is pushed to the existing array.
// The array again has to be stringified for storage in the database file.
// The new array is written back to the database.
const readFromFile = (fileName, note) => {
    reading(fileName, 'utf8')
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
        });
};

// This endpoint responds with the data needed by the menu at /notes to display existing notes.
router.get('/notes', (req, res) => {
    reading ('./db/db.json', 'utf8')
        .then((data) => {
            res.json(JSON.parse(data));
        })
})

router.post('/notes', (req, res) => {

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

router.delete('/notes/:id', (req, res) => {
    const { id } = req.params;

    reading('./db/db.json', 'utf8')
        .then((data) => {
            const parsedNotes = JSON.parse(data);
            const noteDelete = parsedNotes.find(pn => pn.id === id);
            parsedNotes.splice(parsedNotes.indexOf(noteDelete), 1);
            console.log(parsedNotes);
            return parsedNotes;
        })
        .then((data) => {
            writing('./db/db.json', JSON.stringify(data));
        })

    res.send('Note successfully removed from the database.')
});

module.exports = router;