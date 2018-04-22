// Constructor
function Ship(npc, name, sprite, health, attackDice, defenseDice, jumpDice, repairDice) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this);

	// Sprite
	this.sprite = false;
	if(sprite) {
		//this.sprite = new VroomSprite('sprites/' + sprite.name, sprite.animated, sprite.frameLength, this.dim.width, this.dim.height, sprite.frames, 0);
	}

	// General
	this.npc = npc;
	this.name = name;

	// Ship health points
	this.health = health;

	// Dice pools
	this.attackDice = [];
	this.defenseDice = [];
	this.jumpDice = [];
	this.repairDice = [];

	this.diceSpacing = 0;

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

	this.diceAreaPos = {
		x: 100,
		y: Vroom.dim.height - 150,
	};

	// Initiate dice pools
	for(var i = 0; i < this.numberOfAttackDice; i++) {
		this.addAttackDie('d6');
	}

	for(var i = 0; i < this.numberOfDefenseDice; i++) {
		this.addDefenseDie('d4');
	}

	for(var i = 0; i < this.numberOfJumpDice; i++) {
		this.addJumpDie('d8');
	}

	for(var i = 0; i < this.numberOfRepairDice; i++) {
		this.addRepairDie('d6');
	}
};

// Update function. Handles all logic for objects related to this class.
Ship.prototype.update = function(step) {

};

// Add new die to a attack dice pool
Ship.prototype.addAttackDie = function(dieType) {
	var die = new Die(dieType);
	die.pos.x = this.diceAreaPos.x + ((this.diceSpacing + die.dim.width) * this.attackDice.length);
	die.pos.y = this.diceAreaPos.y;
	this.attackDice.push(die);
};

// Add new die to a defense dice pool
Ship.prototype.addDefenseDie = function(dieType) {
	var die = new Die(dieType);
	die.pos.x = this.diceAreaPos.x + ((this.diceSpacing + die.dim.width) * this.defenseDice.length);
	die.pos.y = this.diceAreaPos.y;
	this.defenseDice.push(die);
};

// Add new die to a jump dice pool
Ship.prototype.addJumpDie = function(dieType) {
	var die = new Die(dieType);
	die.pos.x = this.diceAreaPos.x + ((this.diceSpacing + die.dim.width) * this.jumpDice.length);
	die.pos.y = this.diceAreaPos.y;
	this.jumpDice.push(die);
};

// Add new die to a repair dice pool
Ship.prototype.addRepairDie = function(dieType) {
	var die = new Die(dieType);
	die.pos.x = this.diceAreaPos.x + ((this.diceSpacing + die.dim.width) * this.repairDice.length);
	die.pos.y = this.diceAreaPos.y;
	this.repairDice.push(die);
};

// Remove die from a dice pool
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

// Register all dice in a dice pool
Ship.prototype.activateDicePool = function(dicePoolName) {
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

// Deactivate all dice pools
Ship.prototype.deactivateAllDicePools = function() {
	var allDice = this.attackDice.concat(this.defenseDice, this.jumpDice, this.repairDice);

	for(var die in allDice) {
		Vroom.deregisterEntity(allDice[die]._id);
	}
};

// Roll dice in a die pool
Ship.prototype.rollDice = function(dicePoolName) {
	switch(dicePoolName) {
		case 'attack':
			for(var attackDieIndex = 0; attackDieIndex < this.attackDice.length; attackDieIndex++) {
				this.attackDice[attackDieIndex].roll(attackDieIndex);
			}
			break;

		case 'defense':
			for(var defenseDieIndex = 0; defenseDieIndex < this.defenseDice.length; defenseDieIndex++) {
				this.defenseDice[defenseDieIndex].roll(defenseDieIndex);
			}
			break;

		case 'jump':
			for(var jumpDieIndex = 0; jumpDieIndex < this.jumpDice.length; jumpDieIndex++) {
				this.jumpDice[jumpDieIndex].roll(jumpDieIndex);
			}
			break;

		case 'repair':
			for(var repairDieIndex = 0; repairDieIndex < this.repairDice.length; repairDieIndex++) {
				this.repairDice[repairDieIndex].roll(repairDieIndex);
			}
			break;
	}

	return this.countDicePool(dicePoolName);
};

Ship.prototype.countDicePool = function(dicePoolName) {
	var count = 0;

	switch(dicePoolName) {
		case 'attack':
			for(var attackDie in this.attackDice) {
				count += this.attackDice[attackDie].result;
			}
			break;

		case 'defense':
			for(var defenseDie in this.defenseDice) {
				count += this.defenseDice[defenseDie].result;
			}
			break;

		case 'jump':
			for(var jumpDie in this.jumpDice) {
				count += this.jumpDice[jumpDie].result;
			}
			break;

		case 'repair':
			for(var repairDie in this.repairDice) {
				count += this.repairDice[repairDie].result;
			}
			break;
	}

	return count;
};

// Render function. Draws all elements related to this module to screen.
Ship.prototype.render = function(camera) {
	Vroom.ctx.fillStyle = 'red';
	Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);
};

// Destroy all parts of ship properly
Ship.prototype.destroy = function() {
	// Delete all dice
	var allDice = this.attackDice.concat(this.defenseDice, this.jumpDice, this.repairDice);

	for(var die in allDice) {
		Vroom.deleteEntity(allDice[die]._id);
	}
};