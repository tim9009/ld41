var npc = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
npc.init = function() {
	this.layer = 1;

	this.dim = {
		width: 400 * 0.7,
		height: 300 * 0.7,
	};

	this.updateBounds();

	// Position targets
	this.encounterStartPos = {
		x: Vroom.dim.width + (this.dim.width * 2),
		y: (Vroom.dim.height / 2) - 180,
	};

	this.engagedPos = {
		x: Vroom.dim.width - this.dim.width - 200,
		y: (Vroom.dim.height / 2) - 180,
	};

	this.passivePos = {
		x: Vroom.dim.width - this.dim.width - 50,
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

	// Register entity
	Vroom.registerEntity(npc);
};

// Update function. Handles all logic for objects related to this module.
npc.update = function(step) {
	// Update position
	if(this.pos.x !== this.targetPos.x || this.pos.y !== this.targetPos.y) {
		var lerpPercentage = 0.005;

		if(gameSessionState.currentStep === steps.DEFEND) {
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

	switch(gameSessionState.currentStep) {
		// START
		case steps.START:
			// Create new ship if not defined
			if(!this.ship) {
				this.generateShip();
				this.registerShip();
			}

			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('jump');
			break;

		// JUMP
		case steps.JUMP:
			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('jump');
			break;

		// ATTACK
		case steps.ATTACK:
			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('attack');
			break;

		// DEFENSE
		case steps.DEFEND:
			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('defense');
			break;

		// REPAIR
		case steps.REPAIR:
			// Load dice pool
			this.ship.deactivateAllDicePools();
			this.ship.activateDicePool('repair');
			break;
	}
};

npc.generateShip = function() {
	this.ship = new Ship(false, 'Rocinate', 'sprites/npc-1.png', 50, 2, 3, 4, 2);
	this.ship.dim.width = this.dim.width;
	this.ship.dim.height = this.dim.height;
};

npc.registerShip = function() {
	Vroom.registerEntity(this.ship);
};

npc.deregisterShip = function() {
	Vroom.deregisterEntity(this.ship);
};

npc.deleteShip = function() {
	this.ship.destroy();
};

npc.onStepChange = function(lastStep, currentStep) {
	switch(currentStep) {
		case steps.START:
			this.targetPos.x = this.centerPos.x;
			this.targetPos.y = this.centerPos.y;
			this.pos.x = this.centerPos.x;
			this.pos.y = this.centerPos.y;
			break;

		case steps.ENCOUNTER:
			this.targetPos.x = this.passivePos.x;
			this.targetPos.y = this.passivePos.y;
			this.pos.x = this.encounterStartPos.x;
			this.pos.y = this.encounterStartPos.y;
			break;

		case steps.ATTACK:
			this.targetPos.x = this.passivePos.x;
			this.targetPos.y = this.passivePos.y;
			break;

		case steps.DEFEND:
			this.targetPos.x = this.engagedPos.x;
			this.targetPos.y = this.engagedPos.y;
			break;

		case steps.JUMP:
			this.targetPos.x = this.centerPos.x;
			this.targetPos.y = this.centerPos.y;
			break;
	}
};

// Render function. Draws all elements related to this module to screen.
npc.render = function(camera) {
	
};

// Init call
npc.init();