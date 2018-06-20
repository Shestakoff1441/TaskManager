var express = require("express");
var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID; 
var app = express();
var jsonParser = bodyParser.json();
var fs = require('fs');
var file = __dirname + '/config.json';
var url; /*= "mongodb://localhost:27017/organizerdb"*/;
var port;
fs.readFile(file, 'utf8', function (err,data){
    data = JSON.parse(data); 
    port = data.server.port;
    url = 'mongodb://'+data.mongodb.url+":"+data.mongodb.port+"/"+data.mongodb.dbname+'';
    app.listen(port);
});


app.use(express.static(__dirname + "/public"));

app.get("/api/tasks", function(req, res){ 
    mongoClient.connect(url, function(err, db){
        db.collection("tasks").find({}).toArray(function(err, tasks){
            res.send(tasks)
            db.close();
        });
    });
});

app.post("/api/tasks", jsonParser, function (req, res) { 
    if(!req.body) return res.sendStatus(400);
    var taskName = req.body.name;
    var color    = req.body.color;
    var taskDate = req.body.date;
    var task = {
            name:taskName,
            task_color:color
        };
    mongoClient.connect(url, function(err, db){
        db.collection("tasks").insertOne(task, function(err, result){
            if(err) return res.status(400).send(); 
            res.send(task);
            db.close();
        });
    });
});

app.get("/api/underTasks", function(req, res){
    mongoClient.connect(url, function(err, db){
        db.collection("underTasks").find({}).toArray(function(err, underTask){
            res.send(underTask)
            db.close();
        });
    });
});

app.post("/api/underTasks", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    var id = new objectId(req.params.id);
    var taskName = req.body.taskName;
    var taskDescription = req.body.task_description;
    var color_task = req.body.task_color;
    var taskDate = req.body.data_value;
    var taskTime = req.body.time_value;
    var taskTime2 = req.body.time_value2;
    var list_value = req.body.list_value;

    var underTask = {
    	name_task: taskName,
        dater: taskDate,
        timer : taskTime,
    	timer2 : taskTime2,
    	value:list_value,
        _id:id,
        color:color_task,
        description:taskDescription
    };
    mongoClient.connect(url, function(err, db){
        db.collection("underTasks").insert(underTask, function(err, result){
            if(err) return res.status(400).send();
            res.send(underTask);
            db.close();
        });
    });
});

app.delete("/api/underTasks/:id", function(req, res){
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("underTasks").findOneAndDelete({_id: id}, function(err, result){
            if(err) return res.status(400).send();
            res.send(id);
            db.close();
        });
    });
});

app.delete("/api/tasks/:id", function(req, res){
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("tasks").findOneAndDelete({_id: id}, function(err, result){
            if(err) return res.status(400).send();
            res.send(id);
            db.close();
        });
    });
});




  
 
