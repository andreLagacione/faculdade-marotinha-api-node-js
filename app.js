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

app.use('/', require('./router'));

app.listen(port);

console.log('Application running in port ' + port);