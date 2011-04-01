Testcase generator for the web-testsuite
==========================================================

This peace of code generates test cases by parsing 
web specs.

## Supported Specs

- w3c
- WAC 2.0

More specs will be supported soon. Feel free to implement own SpecParsers.

## Requirements:

- Node 0.4.4
- jsdom 0.2.0

## How To Use

		$node testinator.js [parser] [spec URL] [output file]
		
e.g.

		$node testinator.js w3c http://www.w3.org/TR/2011/WD-html5-20110113/video.html w3c-media.js
		
## Credits

- Christian Ranz [christianranz.com](http://christianranz.com) – [@ranzwertig](http://twitter.com/ranzwertig)
- [browserlove.org](http://blog.browserlove.org) – [@browserlove](http://twitter.com/browserlove)
