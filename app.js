var express = require("express"),
fs = require("fs"),
moment = require("moment"),
mongoose = require('mongoose'),
bodyParser = require("body-parser");
app = express();
Temp =  require("./models/temp.js");
Humid =  require("./models/humid.js");
Rpm =  require("./models/rpm.js");


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/hackhub", {useNewUrlParser:true});


app.get("/",function(req, res){
    // console.log(typeof(time));
    Rpm.find({}, function(err, rpms){
        if(err){
            console.log(err);
        }else{
            res.render("index", {rpms : rpms})
        }

    })
})
app.get("/slider", function(req, res){
    var content = fs.readFileSync('rpm.txt', 'utf-8')
    res.send(content);
})
app.post("/temp", function(req, res){
    console.log("Temp");
    console.log(req.body);

    fs.writeFile("temp.txt",req.body.value,function(err){
        if (err){
            console.log(err);
        }
        else{
            var time = Date.now();
            Temp.create({
                chart_value : [
                    {
                        t : time,
                        y : Number(req.body.value)
                    }
                ]
            },function(err, newTemp){
                if (err){
                    console.log(err);
                }
                else{
                    console.log("Value saved");
                }
            })
        }
    })
    res.redirect("/");
})

app.post("/humid", function(req, res){
    console.log("Humid");
    console.log(req.body);

    fs.writeFile("humid.txt",req.body.value,function(err){
        if (err){
            console.log(err);
        }
        else{
            var time = Date.now();
            Humid.create({
                chart_value : [
                    {
                        t : time,
                        y : Number(req.body.value)
                    }
                ]
            },function(err, newHumid){
                if (err){
                    console.log(err);
                }
                else{
                    console.log("Value saved");
                }
            })
        }
    })
    res.redirect("/");
})
app.post("/rpm", function(req, res){
    console.log("RPM");
    console.log(req.body);

    fs.writeFile("rpm.txt",req.body.value,function(err){
        if (err){
            console.log(err);
        }
        else{
            var time = Date.now();
            Rpm.create({
                chart_value : [
                    {
                        t : time,
                        y : Number(req.body.value)
                    }
                ]
            },function(err, newTemp){
                if (err){
                    console.log(err);
                }
                else{
                    console.log("Value saved");
                }
            })
        }
    })
    res.redirect("/");
})

var port = process.env.port || 3000;
app.listen(port, function(){
    console.log("Server is running!!");
});