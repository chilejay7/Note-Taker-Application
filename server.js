const express = require('express');
const app = express();

const util = require('util');
const path = require('path');

const PORT = 8081;

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.render('notes')
    res.send("Take some notes!")
})

app.get('/api/notes/:id', () => {
    res.send('Here are your notes.')
})

app.post('/api/notes', (req, res) => {
    res.send('Creating your notes.')
})

app.get('*', (req, res) => {
    res.render('index')
})

app.listen(PORT, () => {
    console.log(`Server listenting on Port: ${PORT}`)
})