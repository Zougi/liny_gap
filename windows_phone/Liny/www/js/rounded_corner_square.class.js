/**
 * @fileOverview  filter color square maker
 * @author Zg
 * @version 0.1
 * @link http://www.liny.info
 */

/**
 * @name draw
 * @function draw square
 * @memberOf RoundedCornerSquare
 */
function RoundedCornerSquare_draw() {
	this.ctx.beginPath();
	
	this.ctx.moveTo(this.pos, this.pos + this.radius);

	this.ctx.lineTo(this.pos, this.pos + this.width - this.radius);
	this.ctx.quadraticCurveTo(this.pos, this.pos + this.width, this.pos + this.radius, this.pos + this.width);
	this.ctx.lineTo(this.pos + this.width - this.radius, this.pos + this.width);
	this.ctx.quadraticCurveTo(this.pos + this.width, this.pos + this.width, this.pos + this.width, this.pos + this.width - this.radius);
	this.ctx.lineTo(this.pos + this.width, this.pos + this.radius);
	this.ctx.quadraticCurveTo(this.pos + this.width, this.pos, this.pos + this.width - this.radius, this.pos);
	this.ctx.lineTo(this.pos + this.radius, this.pos);
	this.ctx.quadraticCurveTo(this.pos, this.pos, this.pos, this.pos + this.radius);

	this.ctx.strokeStyle = this.strokeColor();
	this.ctx.lineWidth = this.strokeWidth();
	this.ctx.stroke(); 

	this.ctx.fillStyle = this.color();
	this.ctx.fill();
}

/**
 * @name getSquarecolor
 * @function
 * @memberOf RoundedCornerSquare
 */
function getRoundedCornerSquare_Squarecolor() {
		var getColor = $('#' + this.id).data('color'),
			colors;
		
		if (this.id.indexOf('hair') != - 1) {
			colors = colors_hair;
		} else if (this.id.indexOf('eyes') != - 1) {
			colors = colors_eyes;
		} else {
			colors = colors_skin;
		}
		for (var i = 0; i < colors.length - 1; i += 2) {
			if (getColor == colors[i]) {
				return 'rgb(' + colors[i + 1] + ')';
			}
		}
	}

/**
 * @class RoundedCornerSquare - contains all square's info
 * @param {String} id
 */
var RoundedCornerSquare = function(id) {
	var _selected = true;
	this.id = id;
	this.isSelected = function() { return _selected; };
	this.setSelection = function(s) { _selected = s; };
	this.strokeWidth = function() { return _selected ? 9 : 3; };
	this.strokeColor = function() { return _selected ? '#EE6A43' : '#000'; };
	this.radius = 3;
	this.pos = 5;
	this.width = 40;
	this.color = getRoundedCornerSquare_Squarecolor;
	this.draw = RoundedCornerSquare_draw;
	this.ctx = '';
	this.clear = function() {
		var clear_width = this.width + (this.pos * 2) + this.radius;
		this.ctx.clearRect(0, 0, clear_width, clear_width);
	};
}