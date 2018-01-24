const request = require('request');
const rp = require('request-promise');
const querystring = require('querystring');

function check(url, invocationParameters, expectedResultData, expectedResultStatus) {
    const checkResult = {
        urlChecked: null,
        resultData: null,
        resultStatus: null,
        statusTestPassed: null,
        resultDataAsExpected: null
    }

    var options = {
        method: 'GET',
        uri: url,
        qs: invocationParameters, 
        resolveWithFullResponse: true
    }; 
    
    return rp(options).then(function(response) {
        var parsedBody = JSON.parse(response.body);
        checkResult.urlChecked = url + "?" + querystring.stringify(invocationParameters);
        checkResult.resultData = parsedBody;
        checkResult.resultStatus = response.statusCode;
        checkResult.statusTestPassed = (expectedResultStatus === response.statusCode);
        checkResult.resultDataAsExpected = compareResults(expectedResultData, parsedBody);
        return checkResult;
    }, function(response) {

        var parsedBody = JSON.parse(response.error);
        checkResult.urlChecked = url + "?" + querystring.stringify(invocationParameters);
        checkResult.resultData = parsedBody;
        checkResult.resultStatus = response.statusCode;
        checkResult.statusTestPassed = (expectedResultStatus === response.statusCode);
        checkResult.resultDataAsExpected = compareResults(expectedResultData, parsedBody);
        return checkResult;
    }, );
}
                       
function compareResults(expected, actual) {
    if (!expected) return true;
    if (!actual) return false;
    for (let e of Object.keys(expected)) {
        if (actual[e] === undefined || expected[e] != actual[e]) 
            return false;
    }
    return true;
}

module.exports = check
