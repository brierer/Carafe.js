var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodi

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var redis = require("redis"),
    client = redis.createClient();

var q = 'queue';

var open = require('amqplib').connect('amqp://localhost');

// Publisher
var buffer = JSON.stringify({
    _key: 'asfd',
    _eq: "show = show([mytable,mydesc])" + '\n' + "mytabledata = [[1,2,3,4,3,4,y],[2,2,3,5,6,7,8]]" + '\n' + "mytable = table(mytabledata,{col:[\"Asdf\",\"asdf\"],tt:[]})" + '\n' + "y=2" + '\n' + "mydesc =  descriptive([1,2,3,4,5])",
    _event: [{
        "_type": "CreateRow",
        "_pos": 0,
        "_hook": {
            "index": 1,
            "number": 1,
            "old": "",
            "now": "",
        }
    }]
})

open.then(function(conn) {
    var ok = conn.createChannel();
    ok = ok.then(function(ch) {
        ch.assertQueue(q);
        ch.sendToQueue(q, new Buffer(buffer));
    });
    return ok;
}).then(null, console.warn);


var interval = setInterval(function() {
    client.get("asfd", function(err, reply) {
        console.log(reply.toString()); // Will print `OK`
    });
    clearInterval(interval)
}, 500);
//-------------------------------
var get = 0
app.get('/getCalcResult', function(req, res) {
    var interval = setInterval(function() {
        if (get < 5) {
            get = get + 1
            res.send("")
        } else {
            client.get("asfd", function(err, reply) {
                res.send(reply.toString());
            });
        }
        clearInterval(interval)
    }, 1);
})

app.post('/postCalcResult', function(req, res) {
    var interval = setInterval(function() {
        open.then(function(conn) {
            console.log(JSON.stringify(req.body))
            var ok = conn.createChannel();
            ok = ok.then(function(ch) {
                ch.assertQueue(q);
                ch.sendToQueue(q, new Buffer(JSON.stringify(req.body)));
            });
            return ok;
        }).then(null, console.warn);
        console.log("fini")
        res.send("fini");
        clearInterval(interval)
    }, 1);

})




/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});





module.exports = app;
