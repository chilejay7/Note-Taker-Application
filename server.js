const express = require('express');
const app = express();

const util = require('util');
const path = require('path');
const db = require('./db/db.json');

const PORT = 8081;

app.use(express.static('public'));
app.use(express.json());

const stringData = JSON.stringify(db);

app.get('/notes', (req, res) => {
    // res.sendFile(path.join(__dirname, '/public/notes.html'));
    
    console.log(req)
});

app.get('/api/notes', (req, res) => {
    res.json(db);
    // res.send('Here are your notes.')
})

app.get('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    res.send('Here are your notes.')
});

app.post('/api/notes', (req, res) => {
    res.send('Creating your notes.')
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listenting on Port: ${PORT}`)
});