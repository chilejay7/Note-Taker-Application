const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;

const util = require('util');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const db = require('./db/db.json');

app.use(express.static('public'));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// The GET request initiated by clicking the Get Started button on the home page will provide the notes.html document.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
    
    console.info(req.method)
});

// This endpoint responds with the data needed by the menu at /notes to display existing notes.
app.get('/api/notes', (req, res) => {
    res.json(db);
})

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    res.send('Here are your notes.')
});

// This route receives POST requests when the save button is used.
app.post('/api/notes', (req, res) => {

        // The title and text from the new note created are destructured from the request's body property.  They are used to create a new object.
        const { title, text } = req.body
        console.log(title, text)

        // A new objet is created using the properties from the request.  A uuid is added to each object for use in retrieval of the notes.
        const newNote = {
            title,
            text,
            id: uuid(),
        }

        // The database file is read to retrieve existing notes already in the database.
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err) 
            } else {
                // Notes are first parsed since they have to be stringified for storage.
                const parsedNotes = JSON.parse(data);

                // The new object from the POST request is pushed to the existing array.
                parsedNotes.push(newNote);
                console.log(parsedNotes);

                // The array again has to be stringified for storage in the database file.
                const newString = JSON.stringify(parsedNotes);

                // The new array is written back to the database.
                fs.writeFile('./db/db.json', newString, (err) => {
                    err ? console.log(err) : console.log('Data written to db')
                });
                res.json(db)
            }
        });
});

// This route will return the user to the home page if they navigate to an endpoint that has not been defined.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// The listener starts the server and will use the port number defined within the PORT variable.
app.listen(PORT, () => {
    console.log(`Server listenting on Port: ${PORT}`)
});