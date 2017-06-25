var Cylon = require('cylon');
var express = require('express');
var http = require('http');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var sd = require('silly-datetime');
var port = 3000;
const data=[];
    app.use(express.static(__dirname+'/'));//设置静态文件目录
    app.get('/',function(req,res){
        res.sendFile('index.html');//渲染一个html文件，在这个html文件中来展示数据
    });
    server.listen(port,function(){
        console.log("正在监听%d端口...",port);
    });
    connectMongo();
    
    Cylon.api('http');   
    Cylon.robot({
        connections: {
            arduino: { adaptor: 'firmata', port: 'COM10' }
        },
        devices: {
            sensor: { driver: 'analog-sensor', pin: 4, lowerLimit: 100, upperLimit: 900 },
            sensor1: { driver: 'analog-sensor', pin: 5, lowerLimit: 100, upperLimit: 900 },
            sensor2: {driver: 'analog-sensor', pin: 3},
          
        },
        work: function(my) {
            
            //读取传感器数值
            io.on('connection', function(socket){
                every((1).second(), function() {//频率是2Hz,就是1秒读取一次温度
                    data[0] = my.sensor.analogRead()+8;
                    data[1] = my.sensor1.analogRead()+100;
                    data[2] = my.sensor2.analogRead()+300;
                    io.emit('news', data);
                });
                //analogValue*500/1023是将传感器数值转换成摄氏度。取一位小数
                //用socket.io把数值绑定在news这个名字上，前端也会用这个名字来读取这个值
                console.log('a user connected');
                socket.on('disconnect', function(){
                    console.log('user disconnected');
                });
            });
        }
    }).start();


/*连接数据库*/ 
function connectMongo(){
        // connection URL
    var url = 'mongodb://localhost:27017/myproject';
        // use connect method to connect to the Server
    MongoClient.connect(url, function(err, db){
            assert.equal(null, err);
            console.log("连接数据库成功");
            insertDocuments(db, function(){  
               //db.close();             
        });
  });
}
var insertDocuments = function(db, callback){
        setInterval(function(){
            // Get the documents collection
            var collection = db.collection('documents');
            var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm');
            // insert some documents
            collection.insertMany([
                {temp : data[0], hum : data[1],lux : data[2],time}
            ],function(err, result){
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                assert.equal(1, result.ops.length);
                console.log("Inserted 1 documents into the documents collection");
                callback(err);    
            })

        },20000);
 
}

// Find All insertDocuments
var findDocuments =  function(db, callback){
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err, docs){
        assert.equal(err, null);
        // assert.equal(27, docs.length);
        console.log("Find the following records");
        console.dir(docs);
        callback(docs);
    });
};

