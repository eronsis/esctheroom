var socket;
socket = io.connect('http://192.168.0.12:3000');

var data;

$(function() {

    $("#reset").click(function() {
	window.endTime = new Date();
	window.endTime.setHours(window.endTime.getHours() +1);
	data = {
	    isCountdown : true,
	    hr  : document.getElementById("hours").innerHTML,
	    min : document.getElementById("minutes").innerHTML,
	    sec : document.getElementById("seconds").innerHTML,
	    end : window.endTime
	};
	socket.emit('start timer', data);
    });
});

socket.on('countdown time', function(data) {
    document.getElementById("hours").innerHTML = data.hr;
    document.getElementById("minutes").innerHTML = data.min;
    document.getElementById("seconds").innerHTML = data.sec; 
});
