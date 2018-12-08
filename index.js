const express = require('express'),
    app = express(),
    opn = require('opn'),
    port = 3001;

const posts = require('./parser');
app.use(express.static('build'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/check/', posts);

module.exports = app;

app.listen(port);
opn('http://localhost:' + port);
console.log('Nodejs start at http://localhost:' + port);