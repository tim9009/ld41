// Constructor
function Ship(npc, sprite, health, attackDice, defenseDice, jumpDice, repairDice) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this);

	// Sprite
	this.sprite = false;
	if(sprite) {
		//this.sprite = new VroomSprite('sprites/' + sprite.name, sprite.animated, sprite.frameLength, this.dim.width, this.dim.height, sprite.frames, 0);
	}

	// Ship health points
	this.health = health;

	// Dice pools
	this.attackDice = [];
	this.defenseDice = [];
	this.jumpDice = [];
	this.repairDice = [];

	// Number of dice
	this.numberOfAttackDice = attackDice;
	this.numberOfDefenseDice = defenseDice;
	this.numberOfJumpDice = jumpDice;
	this.numberOfRepairDice = repairDice;

	this.init();
}

// Set correct prototype and costructor
Ship.prototype = Object.create(VroomEntity.prototype);
Ship.prototype.constructor = Ship;

// Init function
Ship.prototype.init = function() {
	this.layer = 1;

	this.dim = {
		width: 100,
		height: 60,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};

	// Initiate dice pools
	for(var i = 0; i < this.numberOfAttackDice; i++) {
		this.addAttackDie();
	}

	for(var i = 0; i < this.numberOfDefenseDice; i++) {
		this.addDefenseDie();
	}

	for(var i = 0; i < this.numberOfJumpDice; i++) {
		this.addJumpDie();
	}

	for(var i = 0; i < this.numberOfRepairDice; i++) {
		this.addRepairDie();
	}
};

// Update function. Handles all logic for objects related to this class.
Ship.prototype.update = function(step) {

};

// Add new die to a attack dice pool
Ship.prototype.addAttackDie = function() {
	this.attackDice.push(new Die('d6'));
};

// Add new die to a defense dice pool
Ship.prototype.addDefenseDie = function() {
	this.defenseDice.push(new Die('d6'));
};

// Add new die to a jump dice pool
Ship.prototype.addJumpDie = function() {
	this.jumpDice.push(new Die('d6'));
};

// Add new die to a repair dice pool
Ship.prototype.addRepairDie = function() {
	this.repairDice.push(new Die('d6'));
};

// Remove die from a die pool
Ship.prototype.removeDie = function(dicePoolName) {
	switch(dicePoolName) {
		case 'attack':
			this.attackDice.splice(this.attackDice.length - 1, 1);
			break;

		case 'defense':
			this.defenseDice.splice(this.defenseDice.length - 1, 1);
			break;

		case 'jump':
			this.jumpDice.splice(this.jumpDice.length - 1, 1);
			break;

		case 'repair':
			this.repairDice.splice(this.repairDice.length - 1, 1);
			break;
	}
};

// Activate a die pool
Ship.prototype.activatePool = function(dicePoolName) {
	switch(dicePoolName) {
		case 'attack':
			for(var attackDie in this.attackDice) {
				Vroom.registerEntity(this.attackDice[attackDie]);
			}
			break;

		case 'defense':
			for(var defenseDie in this.defenseDice) {
				Vroom.registerEntity(this.defenseDice[defenseDie]);
			}
			break;

		case 'jump':
			for(var jumpDie in this.jumpDice) {
				Vroom.registerEntity(this.jumpDice[jumpDie]);
			}
			break;

		case 'repair':
			for(var repairDie in this.repairDice) {
				Vroom.registerEntity(this.repairDice[repairDie]);
			}
			break;
	}
};

// Roll dice in a die pool
Ship.prototype.rollDice = function(dicePoolName) {
	switch(dicePoolName) {
		case 'attack':
			for(var attackDie in this.attackDice) {
				this.attackDice[attackDie].roll();
			}
			break;

		case 'defense':
			for(var defenseDie in this.defenseDice) {
				this.defenseDice[defenseDie].roll();
			}
			break;

		case 'jump':
			for(var jumpDie in this.jumpDice) {
				this.jumpDice[jumpDie].roll();
			}
			break;

		case 'repair':
			for(var repairDie in this.repairDice) {
				this.repairDice[repairDie].roll();
			}
			break;
	}
};

// Render function. Draws all elements related to this module to screen.
Ship.prototype.render = function(camera) {
	Vroom.ctx.fillStyle = 'red';
	Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);
};