var sys = require("sys"),
    http = require("http"),
    fs = require('fs'),
    jsdom = require('jsdom'),
    util = require('util'),
    url = require('url');

var agrs = process.argv;

var specUrl = agrs[3];
var pUrl = url.parse(specUrl);
console.log(util.inspect(pUrl));
var options = {
    host: pUrl.host,
    port: pUrl.port === undefined? 80 : pUrl.port,
    path: (pUrl.pathname === undefined ? '' : pUrl.pathname)+(pUrl.search === undefined ? '' : pUrl.search)+(pUrl.hash === undefined ? '' : pUrl.hash)
};
console.log(util.inspect(options));
var generateTestFile = function(tests){
    var objectsToString = function(testCaseObject){
        var testCaseString = '\t{\n';
        testCaseString += '\t\tid:'+testCaseObject.id+',\n';
        testCaseString += '\t\tname:"'+testCaseObject.name +'",\n';
        testCaseString += '\t\tdefinedInSpecs:["'+testCaseObject.definedInSpecs+'"],\n';
        testCaseString += '\t\ttest:function(t){\n';
        testCaseString += '\t\t\t//\tadd the test here\n';
        testCaseString += '\t\t}\n';
        testCaseString += '\t},\n';
        return testCaseString;
    };
    
    var testString = 'var testCases = [\n';
    for (var i = 0; i < tests.length; i += 1){
        testString += objectsToString(tests[i]);
    }
    testString += '];';
    var filename = agrs[4];
    fs.writeFile(filename, testString, function (err) {
		if (err) throw err;
		console.log('It\'s saved!');
	});
};

var selectParser = agrs[2];
try {
	var parserModule = require('./parser/'+selectParser);
} catch (err) {
	console.log('there is no parser module for '+selectParser);
	process.exit(0);
}

if (typeof parserModule.SpecParser === 'function'){  
    http.get(options, function(response){
        var responseData;
        response.on('data', function (chunk){
            responseData += chunk;
        });
        response.on('end', function () {
            var parser = new parserModule.SpecParser();
            var tests = [];
            parser.on('onTest', function(testCaseObject){
                tests.push(testCaseObject);
            });
            parser.on('end', function(){
                generateTestFile(tests);
            });
            parser.parseSpec(responseData, specUrl);
        });
        console.log("Got response: " + response.statusCode);
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}
else {
    console.log('there is no parser module for '+selectParser);
}

	
