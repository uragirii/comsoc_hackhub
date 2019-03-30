var mongoose = require("mongoose");


var rpmSchema = new mongoose.Schema({
    chart_value :[{
        t : {type : Date, default:Date.now},
        y : Number
    }
    ]
});

module.exports = mongoose.model("RPM", rpmSchema);