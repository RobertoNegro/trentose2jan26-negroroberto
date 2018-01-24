const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const checker = require('./checker');

app.set('port', (process.env.PORT || 5000));

app.get('/count', function (req, res) {
    res.json({
        count: 5
    })
});

app.get('/sum', function (req, res) {
    var n1;
    n1 = Number(req.query.n1);
    if (n1 != parseInt(req.query.n1))
        n1 = NaN;

    var n2;
    n2 = Number(req.query.n2);
    if (n2 != parseInt(req.query.n2))
        n2 = NaN;

    if (validInt(n1) && validInt(n2)) {
        var sum = n1 + n2;
        res.status(200).send({
            sum: sum
        })
    } else
        res.status(400).send({
            status: 400,
            message: "Missing or invalid parameters!"
        });
});

app.post('/check', function (req, res) {
    const url = req.body.url;
    const invocationParameters = req.body.invocationParameters;
    const expectedResultData = req.body.expectedResultData;
    const expectedResultStatus = req.body.expectedResultStatus;

    if (url && invocationParameters && expectedResultData && expectedResultStatus) {
        checker(url, invocationParameters, expectedResultData, expectedResultStatus).then((checkResult) => {
            res.status(200).send(checkResult);
        });
    } else {
        res.status(400).send({
            status: 400,
            message: "Missing parameters!"
        });
    }
});


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

function validInt(value) {
    if (arguments.length !== 1)
        return false;
    if (value instanceof Array)
        return false;
    if (value === Infinity || value === -Infinity)
        return true;
    if (isNaN(value))
        return false;
    if (isNaN(parseInt(value)))
        return false;
    if (parseInt(Number(value)) !== value)
        return false;
    return true;
}
