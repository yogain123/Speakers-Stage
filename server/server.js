const express = require('express');
var app = express();
var cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const port = process.env.PORT || 3003;

var routing = require("./routing");

app.use(bodyParser.json());

require('dotenv').config()

app.use('/', routing);
app.listen(port);