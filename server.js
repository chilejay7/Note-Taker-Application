const express = require('express');
const app = express();

const util = require('util');
const path = require('path');

const PORT = 8081;

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

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