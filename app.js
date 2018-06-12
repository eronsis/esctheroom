var express = require('express');
var app = express();
var server = require('http').createServer(app);


var handlebars = require('express-handlebars');
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

var time = {
    isCountdown : false,
    hr : "01",
    min : "00",
    sec : "00",
    end : "" 
};

var gpio = require('onoff').Gpio;

// If button is not pressed isPressed == false
// If battery is not in isPowered == false
var isPressed = false;
var isPowered = false;
var button = new gpio(17, 'in', 'both');

button.watch(function(err, value) {
    if (err) {
	console.error('Error occurred', err);
	return;
    };
    if(value == 1) {
	isPressed = true;
	console.log('Button pressed');
    }else{
	isPressed = false;
    };
});


app.get('/', function(req, res) {
    res.render('home', {time});
});

server.listen(app.get('port'), function(){
    console.log('NodEx running: localhost' + app.get('port'));
});

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);
var runtimer;

function newConnection(socket) {
    console.log(socket.id);
    socket.on('start timer', countdown);

    function countdown(data) {
	console.log("start timer activated");

	if(time.end == ""){
	    time.end = data.end;
	}
	
	runtimer = setInterval(function() {
	    console.log(isPressed);
	    if (isPressed == true){
		console.log('button pressed time is up');
		clearInterval(runtimer);
	    }else{
		var endTime = (Date.parse(time.end) / 1000);
		var now = new Date();
		now = (Date.parse(now) / 1000);
		var timeLeft = endTime - now;
		var days = Math.floor(timeLeft / 86400);
		var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
		var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
		var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

		if (hours < "10") { hours = "0" + hours; }
		if (minutes < "10") { minutes = "0" + minutes; }
		if (seconds < "10") { seconds = "0" + seconds; }

		time.hr = hours;
		time.min = minutes;
		time.sec = seconds;
		io.emit('countdown time', time);
	    }
	}, 1000);
    };        
};
