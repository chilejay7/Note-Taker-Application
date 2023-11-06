const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;
const apiRoutes = require('./public/assets/routes/api');

const path = require('path');
const db = require('./db/db.json');
// const { readFromFile } = require('./public/assets/js/write_read')

app.use(express.static('public'));

// This allows the /api routes to be separated off into their own file to maintain
// a cleaner structure.
app.use('/api', apiRoutes);

// Middleware for parsing JSON and urlencoded form data.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// The GET request initiated by clicking the Get Started button on the home page will provide the notes.html document.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
    
    console.info(req.method)
});

// This route will return the user to the home page if they navigate to an endpoint that has not been defined.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// The listener starts the server and will use the port number defined within the PORT variable.
app.listen(PORT, () => {
    console.log(`Server listenting on Port: ${PORT}`)
});