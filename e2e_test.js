process.env.NODE_ENV = "testing";
process.env.PORT = 8081;

module.exports = require("./server.js");

var clearAllData = function(done)
{
    var mongoose = require("mongoose");
    let accessment = mongoose.model('Assessment');
    accessment.remove( {},done);

};

clearAllData(function(){});