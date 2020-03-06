const express = require("express");
const bodyParser = require('body-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require("fs");
const csvToJson = require('convert-csv-to-json');
const axios = require('axios').default;

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 4000

const get_donations = express.Router();
app.use("/",get_donations);
require('./Routes/get_donations')(get_donations,csvToJson)

const donate = express.Router();
app.use("/",donate);
require('./Routes/donate_money')(donate,createCsvWriter,fs,csvToJson,path)

const BaseConvert = express.Router();
app.use("/",BaseConvert);
require('./Routes/base_convert')(BaseConvert,csvToJson,axios,path)

const format_nonprofit_data = express.Router();
app.use("/",format_nonprofit_data);
require("./Routes/base_nonprofit")(format_nonprofit_data,csvToJson,axios,createCsvWriter)



app.listen(port, () => console.log(`port is a ${port}`))