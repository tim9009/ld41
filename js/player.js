var player = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
player.init = function() {
	this.layer = 1;

	this.dim = {
		x: 0,
		y: 0,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};

	// Ship
	this.ship = null;

	// Register entity
	Vroom.registerEntity(player);
};

// Update function. Handles all logic for objects related to this module.
player.update = function(step) {
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

player.generateShip = function() {
	this.ship = new Ship(false, 'Rocinate', false, 50, 2, 3, 4, 2);
};

player.registerShip = function() {
	Vroom.registerEntity(this.ship);
};

player.deregisterShip = function() {
	Vroom.deregisterEntity(this.ship);
};

player.deleteShip = function() {
	this.ship.destroy();
};

// Render function. Draws all elements related to this module to screen.
player.render = function(camera) {
	
};

// Init call
player.init();