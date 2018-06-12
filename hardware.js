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
