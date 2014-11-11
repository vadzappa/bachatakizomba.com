var express = require('express'),
    app = express(),
    http = require("http"),
    path = require("path"),
    workingFolder = path.normalize('./web'),
    port = process.env.PORT || 80;

console.log(__dirname);

// simple logger
app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

// respond
app.use(function (req, res, next) {
//    res.sendfile(path.join(__dirname, "/zag.gif"));
    if (req.path === '/') {
        res.sendfile(path.join(workingFolder, '/index.html'));
    } else {
        res.sendfile(path.join(workingFolder, req.path));
    }

});

http.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + port);
});

/*https.createServer(options, app).listen(3000, function () {
 console.log("Express server listening on port " + 3000);
 });*/


module.exports = {};