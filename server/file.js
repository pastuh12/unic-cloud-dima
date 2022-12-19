const express = require("express");
const fs = require("fs");
const http = require("https");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const saveWheather = function (data) {
    const database = "database.json";
    dataFile = fs.readFileSync(database, "utf8");
    dataFile = JSON.parse(dataFile);
    dataFile.history.push(data);
    dataFile = JSON.stringify(dataFile);

    fs.writeFile(database, dataFile, function (err) {
        if (err) return console.log(err);
    });

    return dataFile;
};

const getCountForWeek = function () {
    const week = 604800000;
    const database = "database.json";
    let count = 0;
    let end = new Date();
    end = end - week;

    dataFile = fs.readFileSync(database, "utf8");
    dataFile = JSON.parse(dataFile);

    for (let i = 0; i < dataFile.history.length; i++) {
        count++;
    }

    return count;
};

app.post("/save", (req, res) => {
    let result = saveWheather(req.body.data);
    res.send(result);
});

app.get("/count", (req, res) => {
    let count = getCountForWeek();
    res.send(JSON.stringify(count));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
