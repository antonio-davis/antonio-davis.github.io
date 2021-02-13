/**
 * Slot machine
 * Author: Saurabh Odhyan | http://odhyan.com
 */

/** ******************
 *  _____ _____ _____ 
 * |___  |___  |___  |
 *   / /   / /   / / 
 *  / /   / /   / /  
 * /_/   /_/   /_/   
 *  
 * ******************               
 */

$(document).ready(function () {
	/**
	 * Global variables
	 */
	var completed = 0,
		imgHeight = 1190,
		posArr = [
			0, //orange
			70, //number 7 
			140, //bar
			210, //guava
			280, //banana
			350, //cherry
			420, //orange
			490, //number 7
			560, //bar
			630, //guava
			700, //banana
			770, //cherry
			840, //orange
			910, //number 7
			980, //bar
			1050, //guava
			1120, //banana
			1190 //cherry
		];

	var win = [];
	win[0] = win[420] = win[840] = 1;
	win[70] = win[490] = win[910] = 2;
	win[140] = win[560] = win[980] = 3;
	win[210] = win[630] = win[1050] = 4;
	win[280] = win[700] = win[1120] = 5;
	win[350] = win[770] = win[1190] = 6;

	/**
	 * @class Slot
	 * @constructor
	 */
	function Slot(el, max, step) {
		this.speed = 0; //speed of the slot at any point of time
		this.step = step; //speed will increase at this rate
		this.si = null; //holds setInterval object for the given slot
		this.el = el; //dom element of the slot
		this.maxSpeed = max; //max speed this slot can have
		this.pos = null; //final position of the slot	

		$(el).pan({
			fps: 60,
			dir: 'down'
		});
		$(el).spStop();
	}

	/**
	 * @method start
	 * Starts a slot
	 */
	Slot.prototype.start = function () {
		var _this = this;
		$(_this.el).addClass('motion');
		$(_this.el).spStart();
		_this.si = window.setInterval(function () {
			if (_this.speed < _this.maxSpeed) {
				_this.speed += _this.step;
				$(_this.el).spSpeed(_this.speed);
			}
		}, 100);
	};

	/**
	 * @method stop
	 * Stops a slot
	 */
	Slot.prototype.stop = function () {
		var _this = this,
			limit = 30;
		clearInterval(_this.si);
		_this.si = window.setInterval(function () {
			if (_this.speed > limit) {
				_this.speed -= _this.step;
				$(_this.el).spSpeed(_this.speed);
			}
			if (_this.speed <= limit) {
				_this.finalPos(_this.el);
				$(_this.el).spSpeed(0);
				$(_this.el).spStop();
				clearInterval(_this.si);
				$(_this.el).removeClass('motion');
				_this.speed = 0;
			}
		}, 100);
	};

	/**
	 * @method finalPos
	 * Finds the final position of the slot
	 */
	Slot.prototype.finalPos = function () {
		var el = this.el,
			el_id,
			pos,
			posMin = 2000000000,
			best,
			bgPos,
			i,
			j,
			k;

		el_id = $(el).attr('id');
		pos = $(el).css('background-position'); //for some unknown reason, this does not work in IE
		pos = document.getElementById(el_id).style.backgroundPosition;
		pos = pos.split(' ')[1];
		pos = parseInt(pos, 10);

		for (i = 0; i < posArr.length; i++) {
			for (j = 0;; j++) {
				k = posArr[i] + (imgHeight * j);
				if (k > pos) {
					if ((k - pos) < posMin) {
						posMin = k - pos;
						best = k;
						this.pos = posArr[i]; //update the final position of the slot
					}
					break;
				}
			}
		}

		best += imgHeight + 4;
		bgPos = "0 " + best + "px";
		$(el).animate({
			backgroundPosition: "(" + bgPos + ")"
		}, {
			duration: 200,
			complete: function () {
				completed++;
			}
		});
	};

	/**
	 * @method reset
	 * Reset a slot to initial state
	 */

	Slot.prototype.reset = function () {
		var el_id = $(this.el).attr('id');
		$._spritely.instances[el_id].t = 0;
		$(this.el).css('background-position', '0px 4px');
		this.speed = 0;
		completed = 0;
		$('#result').html('');
	};

	function enableControl() {
		$('#control').attr("disabled", false);
	}

	function disableControl() {
		$('#control').attr("disabled", true);
	}

	function printResult() {
		var res;
		if (win[a.pos] === win[b.pos] && win[a.pos] === win[c.pos]) {
			res = "You Win!";
		} else {
			res = "You Lose";
		}
		$('#result').html(res);
	}

	//create slot objects
	var a = new Slot('#slot1', 30, 1),
		b = new Slot('#slot2', 45, 2),
		c = new Slot('#slot3', 70, 3);

	/**
	 * Slot machine controller
	 */
	$('#control').click(function () {
		var x;
		if (this.innerHTML == "💵") {
			a.start();
			b.start();
			c.start();
			this.innerHTML = "🛑";

			disableControl(); //disable control until the slots reach max speed

			//check every 100ms if slots have reached max speed 
			//if so, enable the control
			x = window.setInterval(function () {
				if (a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed) {
					enableControl();
					window.clearInterval(x);
				}
			}, 100);
		} else if (this.innerHTML == "🛑") {
			a.stop();
			b.stop();
			c.stop();
			this.innerHTML = "🔄";

			disableControl(); //disable control until the slots stop

			//check every 100ms if slots have stopped
			//if so, enable the control
			x = window.setInterval(function () {
				if (a.speed === 0 && b.speed === 0 && c.speed === 0 && completed === 3) {
					enableControl();
					window.clearInterval(x);
					printResult();
				}
			}, 100);
		} else { // reset
			a.reset();
			b.reset();
			c.reset();
			this.innerHTML = "💵";
		}
	});
});