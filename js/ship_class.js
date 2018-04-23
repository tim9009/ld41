// Constructor
function Ship(npc, name, sprite, health, attackDice, defenseDice, jumpDice, repairDice) {
	// Extend VroomEntity NOTE: default arguments are placeholders and need to be replaced or defined.
	VroomEntity.call(this);

	// Sprite
	if(sprite) {
		this.sprite = new VroomSprite(sprite, false, 1, 400, 300, 0, 0);
	}

	// Constants
	this.dicePools = {};
	this.dicePools.NONE = 'none';
	this.dicePools.ATTACK = 'attack';
	this.dicePools.DEFENSE = 'defense';
	this.dicePools.JUMP = 'jump';
	this.dicePools.REPAIR = 'repair';

	// General
	this.npc = npc;
	this.name = name;

	// Ship health points
	this.healthLimit = health;
	this.health = health;
	this.alive = true;

	// Dice pools
	this.attackDice = [];
	this.defenseDice = [];
	this.jumpDice = [];
	this.repairDice = [];

	this.activeDicePool = this.dicePools.NONE;
	this.activeDicePoolRolling = false;
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
		width: 400,
		height: 300,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};

	// Sett dice area position
	this.updateDiceAreaPos();

	// Initiate dice pools
	for(var i = 0; i < this.numberOfAttackDice; i++) {
		this.addAttackDie('d8');
	}

	for(var i = 0; i < this.numberOfDefenseDice; i++) {
		this.addDefenseDie('d4');
	}

	for(var i = 0; i < this.numberOfJumpDice; i++) {
		this.addJumpDie('d6');
	}

	for(var i = 0; i < this.numberOfRepairDice; i++) {
		this.addRepairDie('d4');
	}
};

// Update function. Handles all logic for objects related to this class.
Ship.prototype.update = function(step) {
	// Check if any dice are rolling
	this.activeDicePoolRolling = false;
	var allDice = this.attackDice.concat(this.defenseDice, this.jumpDice, this.repairDice);

	for(var die in allDice) {
		if(allDice[die].rolling) {
			this.activeDicePoolRolling = true;
			break;
		}
	}
};

// Add or remove health
Ship.prototype.changeHealth = function(changeAmmount) {
	this.health += changeAmmount;
	// check for death
	if(this.health <= 0) {
		this.alive = false;
		this.health = 0;

		if(this.npc) {
			gameSessionState.npcDead = true;
		}
	}

	// Limit health to max
	if(this.health > this.healthLimit) {
		this.health = this.healthLimit;
	}
};

Ship.prototype.applyDamage = function(damage) {
	if(damage > 0) {
		console.log('HIT! Damage: ' + damage);
		this.changeHealth(-damage);
		popupMessage.display(damage + ' DAMAGE');
	} else {
		console.log('MISS!');
		popupMessage.display('MISS!');
	}
};

Ship.prototype.repair = function(repairAmmount) {
	this.changeHealth(repairAmmount);
	popupMessage.display(repairAmmount + ' REPAIRED');
};

Ship.prototype.updateDiceAreaPos = function() {
	var diceAreaMargin = 50;
	var diceInActivePool = 0;
	var diceWidth = 0;

	switch(this.activeDicePool) {
		case this.dicePools.ATTACK:
			diceInActivePool = this.attackDice.length;
			diceWidth = this.attackDice[0].dim.width;
			break;

		case this.dicePools.DEFENSE:
			diceInActivePool = this.defenseDice.length;
			diceWidth = this.defenseDice[0].dim.width;
			break;
	}

	if(this.npc) {
		this.diceAreaPos = {
			x: Vroom.dim.width - (diceInActivePool * diceWidth) - diceAreaMargin,
			y: Vroom.dim.height - 150,
		};
	} else {
		this.diceAreaPos = {
			x: diceAreaMargin,
			y: Vroom.dim.height - 150,
		};
	}

	// Update attack dice positions
	for(var i = 0; i < this.attackDice.length; i++) {
		this.attackDice[i].pos.x = this.diceAreaPos.x + ((this.diceSpacing + this.attackDice[i].dim.width) * i);
		this.attackDice[i].pos.y = this.diceAreaPos.y;
	}

	// Update defense dice positions
	for(var i = 0; i < this.defenseDice.length; i++) {
		this.defenseDice[i].pos.x = this.diceAreaPos.x + ((this.diceSpacing + this.defenseDice[i].dim.width) * i);
		this.defenseDice[i].pos.y = this.diceAreaPos.y;
	}

	// Update jump dice positions
	for(var i = 0; i < this.jumpDice.length; i++) {
		this.jumpDice[i].pos.x = this.diceAreaPos.x + ((this.diceSpacing + this.jumpDice[i].dim.width) * i);
		this.jumpDice[i].pos.y = this.diceAreaPos.y;
	}

	// Update repair dice positions
	for(var i = 0; i < this.repairDice.length; i++) {
		this.repairDice[i].pos.x = this.diceAreaPos.x + ((this.diceSpacing + this.repairDice[i].dim.width) * i);
		this.repairDice[i].pos.y = this.diceAreaPos.y;
	}
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
		case this.dicePools.ATTACK:
			this.attackDice.splice(this.attackDice.length - 1, 1);
			break;

		case this.dicePools.DEFENSE:
			this.defenseDice.splice(this.defenseDice.length - 1, 1);
			break;

		case this.dicePools.JUMP:
			this.jumpDice.splice(this.jumpDice.length - 1, 1);
			break;

		case this.dicePools.REPAIR:
			this.repairDice.splice(this.repairDice.length - 1, 1);
			break;
	}
};

// Register all dice in a dice pool
Ship.prototype.activateDicePool = function(dicePoolName) {
	switch(dicePoolName) {
		case this.dicePools.ATTACK:
			for(var attackDie in this.attackDice) {
				Vroom.registerEntity(this.attackDice[attackDie]);
			}
			break;

		case this.dicePools.DEFENSE:
			for(var defenseDie in this.defenseDice) {
				Vroom.registerEntity(this.defenseDice[defenseDie]);
			}
			break;

		case this.dicePools.JUMP:
			for(var jumpDie in this.jumpDice) {
				Vroom.registerEntity(this.jumpDice[jumpDie]);
			}
			break;

		case this.dicePools.REPAIR:
			for(var repairDie in this.repairDice) {
				Vroom.registerEntity(this.repairDice[repairDie]);
			}
			break;
	}

	this.activeDicePool = dicePoolName;
	this.updateDiceAreaPos();
};

// Deactivate all dice pools
Ship.prototype.deactivateAllDicePools = function() {
	var allDice = this.attackDice.concat(this.defenseDice, this.jumpDice, this.repairDice);

	for(var die in allDice) {
		allDice[die].rolling = false;
		Vroom.deregisterEntity(allDice[die]._id);
	}

	this.activeDicePool = this.dicePools.NONE;
};

// Roll dice in a die pool
Ship.prototype.rollDice = function(dicePoolName) {
	// Set selected dice pool to currently active dice pool if not specified
	if(!dicePoolName) {
		dicePoolName = this.activeDicePool;
	}

	switch(dicePoolName) {
		case this.dicePools.ATTACK:
			for(var attackDieIndex = 0; attackDieIndex < this.attackDice.length; attackDieIndex++) {
				this.attackDice[attackDieIndex].roll(attackDieIndex);
			}
			break;

		case this.dicePools.DEFENSE:
			for(var defenseDieIndex = 0; defenseDieIndex < this.defenseDice.length; defenseDieIndex++) {
				this.defenseDice[defenseDieIndex].roll(defenseDieIndex);
			}
			break;

		case this.dicePools.JUMP:
			for(var jumpDieIndex = 0; jumpDieIndex < this.jumpDice.length; jumpDieIndex++) {
				this.jumpDice[jumpDieIndex].roll(jumpDieIndex);
			}
			break;

		case this.dicePools.REPAIR:
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
		case this.dicePools.ATTACK:
			for(var attackDie in this.attackDice) {
				count += this.attackDice[attackDie].result;
			}
			break;

		case this.dicePools.DEFENSE:
			for(var defenseDie in this.defenseDice) {
				count += this.defenseDice[defenseDie].result;
			}
			break;

		case this.dicePools.JUMP:
			for(var jumpDie in this.jumpDice) {
				count += this.jumpDice[jumpDie].result;
			}
			break;

		case this.dicePools.REPAIR:
			for(var repairDie in this.repairDice) {
				count += this.repairDice[repairDie].result;
			}
			break;
	}

	return count;
};

// Render function. Draws all elements related to this module to screen.
Ship.prototype.render = function(camera) {
	if(this.alive) {
		// Render sprite
		this.sprite.render(this.pos, this.dim, this.dim);

		// Render stats
		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "20px helvetica";
		Vroom.ctx.fillText('Hitpoints: ' + this.health, this.pos.x + 140, this.pos.y);
	}
};

// Destroy all parts of ship properly
Ship.prototype.destroy = function() {
	// Delete all dice
	var allDice = this.attackDice.concat(this.defenseDice, this.jumpDice, this.repairDice);

	for(var die in allDice) {
		Vroom.deleteEntity(allDice[die]._id);
	}
};