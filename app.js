const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
var path = require('path');
const app = express();
const port = process.env.port || 3001;
const corsOptions = {
    origin: true,
    credentials: false
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./src/router'));
app.listen(port);

app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.end('Cannot ' + req.method + ' ' + req.url);
    next(err);
});

console.log('Application running in port ' + port);