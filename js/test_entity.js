var testEntity = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
testEntity.init = function() {
	this.layer = 1;

	this.dim = {
		width: 100,
		height: 100,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};

	this.vel = {
		x: 0,
		y: 0,
	};

	this.speed = 1;

	this.attributeOne = "Hello World";

	// Register entity
	Vroom.registerEntity(testEntity);
};

// Collision event function. Is called every tick the entity is colliding.
testEntity.onCollision = function(target) {
	
};

testEntity.handleInput = function(step) {
	var aPressed = Vroom.isKeyPressed(65);
	var wPressed = Vroom.isKeyPressed(87);
	var dPressed = Vroom.isKeyPressed(68);
	var sPressed = Vroom.isKeyPressed(83);

	if(aPressed) {
		this.pos.x -= this.speed;
	}

	if(dPressed) {
		this.pos.x += this.speed;
	}

	if(wPressed) {
		this.pos.y -= this.speed;
	}

	if(sPressed) {
		this.pos.y += this.speed;
	}
};

// Update function. Handles all logic for objects related to this module.
testEntity.update = function(step) {
	this.handleInput(step);
};

// Render function. Draws all elements related to this module to screen.
testEntity.render = function(camera) {
	Vroom.ctx.fillStyle = 'red';
	Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);
};

// Init call
testEntity.init();