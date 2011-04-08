var events = require('events'),
    jsdom = require('jsdom'),
    util = require('util');

var SpecParser = function(){
};

util.inherits(SpecParser, events.EventEmitter);

SpecParser.prototype.parseSpec = function(data, specUrl){
    var that = this;
    jsdom.env(data, ['http://code.jquery.com/jquery-1.5.min.js'], 
    function(errors, window){
        var $ = window.$;
        var testCases = [];
        var testCaseObjectId = 100;
        var testsTotal =  $("dfn").length;
        var found = 0;
        
        var commit = function(test){
            found += 1;
            that.emit('onTest', test);
            if (found == testsTotal) 
                that.emit('end');
        };
        
        $("dfn").each(function(){
            var testCaseObject = {
                id:testCaseObjectId, 
                name:$(this).attr('title'),
                definedInSpecs:[specUrl+'#'+$(this).attr('id')]
            };
            commit(testCaseObject);
            testCaseObjectId += 100;
        });
    });
    return true;
};

exports.SpecParser = SpecParser;