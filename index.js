var express = require('express'),
    app = express(),
    http = require("http"),
    path = require("path"),
    workingFolder = path.join(__dirname, '/web'),
    registrationComponent = require('./backend/registration'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8090;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// simple logger
app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});


app.post('/backend_register', registrationComponent);
app.get('/backend_register', registrationComponent);

// respond
app.use(function (req, res, next) {
    if (req.path === '/') {
        res.sendfile(path.join(workingFolder, '/index.html'));
    } else if (req.path.indexOf('/backend') === -1) {
        res.sendfile(path.join(workingFolder, req.path));
    } else {
        next();
    }
});

http.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + port);
});

/*https.createServer(options, app).listen(3000, function () {
 console.log("Express server listening on port " + 3000);
 });*/


module.exports = {};