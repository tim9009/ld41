var player = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
player.init = function() {
	this.layer = 1;

	this.dim = {
		width: 400 * 0.7,
		height: 300 * 0.7,
	};

	this.updateBounds();

	// Position targets
	this.encounterStartPos = {
		x: -this.dim.width * 2,
		y: (Vroom.dim.height / 2) - 180,
	};

	this.engagedPos = {
		x: 200,
		y: (Vroom.dim.height / 2) - 180,
	};

	this.passivePos = {
		x: 50,
		y: (Vroom.dim.height / 2) - 180,
	};

	this.centerPos = {
		x: (Vroom.dim.width / 2) - (this.dim.width / 2),
		y: (Vroom.dim.height / 2) - 180,
	};

	// Position state
	this.pos = {
		x: this.centerPos.x,
		y: this.centerPos.y,
	};

	this.targetPos = {
		x: this.centerPos.x,
		y: this.centerPos.y,
	};

	// Ship
	this.ship = null;

	// Xp
	this.xp = 0;

	// Register entity
	Vroom.registerEntity(player);
};

// Update function. Handles all logic for objects related to this module.
player.update = function(step) {
	// Update position
	if(this.pos.x !== this.targetPos.x || this.pos.y !== this.targetPos.y) {
		var lerpPercentage = 0.005;

		if(gameSessionState.currentStep === steps.ATTACK) {
			lerpPercentage = 0.008;
		}

		var lerpedPosition = Vroom.lerpPosition(step, this.pos, this.targetPos, lerpPercentage);
		this.pos.x += lerpedPosition.x;
		this.pos.y += lerpedPosition.y;
	}

	// Update ship position
	if(this.ship) {
		this.ship.pos.x = this.pos.x;
		this.ship.pos.y = this.pos.y;
	}
};

player.reset = function() {
	this.xp = 0;
	this.deleteShip();
};

player.generateShip = function() {
	this.ship = new Ship(false, 'Rocinate', 'sprites/ship-2.png', 50, 2, 3, 1, 2);
	this.ship.dim.width = this.dim.width;
	this.ship.dim.height = this.dim.height;
};

player.registerShip = function() {
	Vroom.registerEntity(this.ship);
};

player.deregisterShip = function() {
	Vroom.deregisterEntity(this.ship);
};

player.deleteShip = function() {
	if(this.ship) {
		this.ship.destroy();
		Vroom.deleteEntity(this.ship._id);
		this.ship = null;
	}
};

player.onStepChange = function(lastStep, currentStep) {
	switch(currentStep) {
		case steps.START:
			// Create new ship if not defined
			if(!this.ship) {
				this.generateShip();
				this.registerShip();
			}

			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('jump');

			this.targetPos.x = this.centerPos.x;
			this.targetPos.y = this.centerPos.y;
			this.pos.x = this.centerPos.x;
			this.pos.y = this.centerPos.y;
			break;

		case steps.ENCOUNTER:
			this.ship.deactivateAllDicePools();

			this.targetPos.x = this.passivePos.x;
			this.targetPos.y = this.passivePos.y;
			this.pos.x = this.encounterStartPos.x;
			this.pos.y = this.encounterStartPos.y;
			break;

		case steps.ATTACK:
			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('attack');

			this.targetPos.x = this.engagedPos.x;
			this.targetPos.y = this.engagedPos.y;
			break;

		case steps.DEFEND:
			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('defense');

			this.targetPos.x = this.passivePos.x;
			this.targetPos.y = this.passivePos.y;
			break;

		case steps.STORE:
			// Load dice pool
			this.ship.deactivateAllDicePools();
			break;

		case steps.JUMP:
			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('jump');

			this.targetPos.x = this.centerPos.x;
			this.targetPos.y = this.centerPos.y;
			break;

		case steps.REPAIR:
			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('repair');

			this.targetPos.x = this.centerPos.x;
			this.targetPos.y = this.centerPos.y;
			break;
	}
};

// Render function. Draws all elements related to this module to screen.
player.render = function(camera) {
	
};

// Init call
player.init();