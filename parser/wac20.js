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
        var testsTotal =  $("div[id^='::']").length;
        var found = 0;
        
        var commit = function(test, nocount){
            if (!nocount) found += 1;
            that.emit('onTest', test);
            if (found == testsTotal) 
                that.emit('end');
        };
		
		$("div[id^='::']").each(function() {
			var mid = $(this).attr('id');
			var hash = '#'+mid;
			var testCaseObject = {
                id:testCaseObjectId, 
                name:mid,
                definedInSpecs:[specUrl+hash],
            };
			commit(testCaseObject, false);
			testCaseObjectId += 100;
			var methods = $(this).children('.methods').children('dl').children('dt');
			for (var i = 0; i < methods.length; i += 1){
				var id = $(methods[i]).attr('id');
				hash = '#'+id;
				var testCaseObject = {
					id:testCaseObjectId, 
					name:mid+'-method-'+id,
					definedInSpecs:[specUrl+hash],
				};
				commit(testCaseObject, true);
				testCaseObjectId += 100;
			}
		});
    });
    return true;
};

exports.SpecParser = SpecParser;
