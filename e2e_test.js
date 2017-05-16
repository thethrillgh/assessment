process.env.NODE_ENV = "testing";
process.env.PORT = 8081;

module.exports = require("./server.js");

var clearAllData = function(done)
{
    var mongoose = require("mongoose");
    let accessmet = mongoose.model("Assessment");
    accessmet.remove( {},done);

};

clearAllData(function(){});