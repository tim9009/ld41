// Constructor
function Die(dieType) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this);
	
	this.dieType = dieType;
	this.baseRollDuration = 500;
	this.baseFaceChangeInterval = 50;

	// Set correct attributes for type of die
	switch(dieType) {
		case 'd4':
			this.faces = [1, 2, 3, 4];
			this.sprite = new VroomSprite('sprites/d4.png', false, 0, 200, 200, 1, 0);
			break;

		case 'd6':
			this.faces = [1, 2, 3, 4, 5, 6];
			this.sprite = new VroomSprite('sprites/d6.png', false, 0, 200, 200, 1, 0);
			break;

		case 'd8':
			this.faces = [1, 2, 3, 4, 5, 6, 7, 8];
			this.sprite = new VroomSprite('sprites/d8.png', false, 0, 200, 200, 1, 0);
			break;
	}

	// State attributes
	this.rolling = false;
	this.rollStart = Date.now();
	this.lastFaceChange = Date.now();
	this.currentFaceShowing = 1;
	this.rollDuration = this.baseRollDuration;
	this.faceChangeInterval = this.baseFaceChangeInterval;
	this.result = 1;

	this.shake = {
		x: 0,
		y: 0,
	};

	this.init();
}

// Set correct prototype and costructor 
Die.prototype = Object.create(VroomEntity.prototype);
Die.prototype.constructor = Die;

// Init function
Die.prototype.init = function() {
	this.layer = 1;

	this.dim = {
		width: 80,
		height: 80,
	};

	this.updateBounds();

	this.pos = {
		x: Vroom.dim.width / 6,
		y: Vroom.dim.height / 2,
	};
};

// Update function. Handles all logic for objects related to this class.
Die.prototype.update = function(step) {
	var now = Date.now();
	// Set final face result when rolling duration is exceeded else set random face
	if(this.rolling && now - this.rollStart < this.rollDuration) {
		// Check face change interval and change face if interval is passed
		if(now - this.lastFaceChange >= this.faceChangeInterval) {
			this.lastFaceChange = now;
			var newFace = this.getRandomFace();
			
			// Re-set new face value if it is the same as current face
			while(newFace == this.currentFaceShowing) {
				newFace = this.getRandomFace();
			}

			this.currentFaceShowing = newFace;
			this.shake.x = Math.floor((Math.random() * 3) - 1);
			this.shake.y = Math.floor((Math.random() * 3) - 1);
		}
	} else {
		// TODO: Face shifting on an interval?
		this.currentFaceShowing = this.result;
		this.rolling = false;
		this.shake.x = 0;
		this.shake.y = 0;
	}
};

// Get a random face
Die.prototype.getRandomFace = function() {
	return Math.floor(Math.random() * (this.faces[this.faces.length - 1] - this.faces[0] + 1)) + this.faces[0];
};

// Roll the die
Die.prototype.roll = function(dieNumber) {
	dieNumber = dieNumber || 1;
	// Calculate roll duration
	this.rollDuration = (this.baseRollDuration * dieNumber) + Math.pow(dieNumber, 3.5);
	console.log('Extra: ', Math.pow(dieNumber, 3.5));

	// Set rolling state
	this.rolling = true;
	this.rollStart = Date.now();
	this.lastFaceChange = Date.now();

	// Get a random die face result
	this.result = this.getRandomFace();
};

// Render function. Draws all elements related to this module to screen.
Die.prototype.render = function(camera) {
	var posWithShake = {
		x: this.pos.x + this.shake.x,
		y: this.pos.y + this.shake.y,
	};

	if(this.sprite) {
		this.sprite.render(posWithShake, this.dim, this.dim);
	}
	
	if(this.rolling) {
		Vroom.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	} else {
		Vroom.ctx.fillStyle = '#fff';
	}

	Vroom.ctx.textAlign = "center";
	Vroom.ctx.font = "40px helvetica";
	Vroom.ctx.fillText(this.currentFaceShowing, posWithShake.x + this.halfDim.width, posWithShake.y + this.halfDim.height + 12);
};


// var die = new Die('d4'); Vroom.registerEntity(die);
// var die2 = new Die('d6'); Vroom.registerEntity(die2);
// die2.pos.x += 100;

// var die3 = new Die('d8'); Vroom.registerEntity(die3);
// die3.pos.x += 200;

// var die4 = new Die('d6'); Vroom.registerEntity(die4);
// die4.pos.x += 300;

// var die5 = new Die('d6'); Vroom.registerEntity(die5);
// die5.pos.x += 400;

// var die6 = new Die('d6'); Vroom.registerEntity(die6);
// die6.pos.x += 500;

// var die7 = new Die('d6'); Vroom.registerEntity(die7);
// die7.pos.x += 600;

// var die8 = new Die('d6'); Vroom.registerEntity(die8);
// die8.pos.x += 700;