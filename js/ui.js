var rollButton = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
rollButton.init = function() {
	this.layer = 2;

	this.dim = {
		width: 300,
		height: 60,
	};

	this.updateBounds();

	this.pos = {
		x: 57,
		y: Vroom.dim.height - 250,
	};

	this.visible = true;
	this.text = 'Start mission!';

	// Register entity
	Vroom.registerEntity(rollButton);
};

// Update function. Handles all logic for objects related to this module.
rollButton.update = function(step) {
	// Reset visible state
	this.visible = true;

	// Hide in certain steps
	if(gameSessionState.currentStep === steps.ENCOUNTER || gameSessionState.currentStep === steps.STORE) {
		this.visible = false;
	}

	//Handle being clicked
	if(Vroom.isEntityClicked(this._id, false)) {
		if(!gameSessionState.stepChangeInProgress && !player.ship.activeDicePoolRolling && !gameSessionState.diceRolledForStep) {
			gameSessionState.playerDiceResult = player.ship.rollDice();
			if(npc.ship) {
				gameSessionState.npcDiceResult = npc.ship.rollDice();
			}

			gameSessionState.diceRolledForStep = true;
		}
	}
};

rollButton.onStepChange = function(lastStep, currentStep) {
	switch(currentStep) {
		case steps.START:
			this.text = 'Start mission!';
			break;

		case steps.ATTACK:
			this.text = 'Roll attack dice';
			break;

		case steps.DEFEND:
			this.text = 'Roll defense dice';
			break;

		case steps.JUMP:
			this.text = 'Roll jump dice';
			break;

		case steps.REPAIR:
			this.text = 'Roll repair dice';
			break;
	}
};

// Render function. Draws all elements related to this module to screen.
rollButton.render = function(camera) {
	if(this.visible) {
		if(Vroom.isMouseOverArea(this.pos, this.dim, false)) {
			Vroom.ctx.fillStyle = '#A5A2A4';
		} else {
			Vroom.ctx.fillStyle = '#808080';
		}

		Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.text, this.pos.x + this.halfDim.width, this.pos.y + this.halfDim.height + 6);
	}
};

// Init call
rollButton.init();



///////////////////////////////////////////////////////////////



var xpScreen = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
xpScreen.init = function() {
	this.layer = 4;

	this.dim = {
		width: Vroom.dim.width,
		height: Vroom.dim.height,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};

	this.visible = false;
	this.margin = 40;
	this.padding = 40;

	// Content positions
	this.contentPos = {
		x: this.pos.x + this.margin + this.padding,
		y: this.pos.y + this.margin + this.padding,
	};

	this.contentDim = {
		width: this.dim.width - (this.margin * 2) - (this.padding * 2),
		height: this.dim.height - (this.margin * 2) - (this.padding * 2),
	};

	// BUTTONS
	this.jumpButton = {
		pos: {
			x: this.contentPos.x + this.contentDim.width - 300,
			y: this.contentPos.y + this.contentDim.height - 60,
		},
		dim: {
			width: 300,
			height: 60,
		},
		text: 'Continue jumping',
		cost: 0,
	};

	this.repairButton = {
		pos: {
			x: this.contentPos.x + this.contentDim.width - 300 - this.jumpButton.dim.width - 10,
			y: this.contentPos.y + this.contentDim.height - 60,
		},
		dim: {
			width: 300,
			height: 60,
		},
		text: 'Attempt repair (15XP)',
		cost: 15,
	};

	// Upgrade attack
	this.addD4ToAttackButton = {
		pos: {
			x: this.contentPos.x + 180,
			y: this.contentPos.y + 115 - 30,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D4 die (30xp)',
		cost: 30,
	};

	this.addD6ToAttackButton = {
		pos: {
			x: this.contentPos.x + 180 + 210,
			y: this.contentPos.y + 115 - 30,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D6 die (45xp)',
		cost: 45,
	};

	this.addD8ToAttackButton = {
		pos: {
			x: this.contentPos.x + 180 + 420,
			y: this.contentPos.y + 115 - 30,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D8 die (55xp)',
		cost: 55,
	};

	// Upgrade defense
	this.addD4ToDefenseButton = {
		pos: {
			x: this.contentPos.x + 180,
			y: this.contentPos.y + 115 - 30 + 70,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D4 die (30xp)',
		cost: 30,
	};

	this.addD6ToDefenseButton = {
		pos: {
			x: this.contentPos.x + 180 + 210,
			y: this.contentPos.y + 115 - 30 + 70,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D6 die (45xp)',
		cost: 45,
	};

	this.addD8ToDefenseButton = {
		pos: {
			x: this.contentPos.x + 180 + 420,
			y: this.contentPos.y + 115 - 30 + 70,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D8 die (55xp)',
		cost: 55,
	};

	// Upgrade repair
	this.addD4ToRepairButton = {
		pos: {
			x: this.contentPos.x + 180,
			y: this.contentPos.y + 115 - 30 + 140,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D4 die (30xp)',
		cost: 30,
	};

	this.addD6ToRepairButton = {
		pos: {
			x: this.contentPos.x + 180 + 210,
			y: this.contentPos.y + 115 - 30 + 140,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D6 die (45xp)',
		cost: 45,
	};

	this.addD8ToRepairButton = {
		pos: {
			x: this.contentPos.x + 180 + 420,
			y: this.contentPos.y + 115 - 30 + 140,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D8 die (55xp)',
		cost: 55,
	};

	// Upgrade jump
	this.addD4ToJumpButton = {
		pos: {
			x: this.contentPos.x + 180,
			y: this.contentPos.y + 115 - 30 + 210,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D4 die (30xp)',
		cost: 30,
	};

	this.addD6ToJumpButton = {
		pos: {
			x: this.contentPos.x + 180 + 210,
			y: this.contentPos.y + 115 - 30 + 210,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D6 die (45xp)',
		cost: 45,
	};

	this.addD8ToJumpButton = {
		pos: {
			x: this.contentPos.x + 180 + 420,
			y: this.contentPos.y + 115 - 30 + 210,
		},
		dim: {
			width: 200,
			height: 60,
		},
		text: 'Add D8 die (55xp)',
		cost: 55,
	};

	// Register entity
	Vroom.registerEntity(xpScreen);
};

// Update function. Handles all logic for objects related to this module.
xpScreen.update = function(step) {
	// Reset visible state
	this.visible = false;

	// Hide in certain steps
	if(gameSessionState.currentStep === steps.STORE) {
		this.visible = true;
	}

	if(this.visible) {
		//Handle being clicked
		
		// Add attack d4 dice
		if(Vroom.isAreaClicked(this.addD4ToAttackButton.pos, this.addD4ToAttackButton.dim, false)) {
			if(this.addD4ToAttackButton.cost <= player.xp){
				player.xp -= this.addD4ToAttackButton.cost;
				player.ship.addAttackDie('d4');
			}
		}

		// Add attack d6 dice
		if(Vroom.isAreaClicked(this.addD6ToAttackButton.pos, this.addD6ToAttackButton.dim, false)) {
			if(this.addD6ToAttackButton.cost <= player.xp){
				player.xp -= this.addD6ToAttackButton.cost;
				player.ship.addAttackDie('d6');
			}
		}

		// Add attack d8 dice
		if(Vroom.isAreaClicked(this.addD8ToAttackButton.pos, this.addD8ToAttackButton.dim, false)) {
			if(this.addD8ToAttackButton.cost <= player.xp){
				player.xp -= this.addD8ToAttackButton.cost;
				player.ship.addAttackDie('d8');
			}
		}



		// Add defense d4 dice
		if(Vroom.isAreaClicked(this.addD4ToDefenseButton.pos, this.addD4ToDefenseButton.dim, false)) {
			if(this.addD4ToDefenseButton.cost <= player.xp){
				player.xp -= this.addD4ToDefenseButton.cost;
				player.ship.addDefenseDie('d4');
			}
		}

		// Add defense d6 dice
		if(Vroom.isAreaClicked(this.addD6ToDefenseButton.pos, this.addD6ToDefenseButton.dim, false)) {
			if(this.addD6ToDefenseButton.cost <= player.xp){
				player.xp -= this.addD6ToDefenseButton.cost;
				player.ship.addDefenseDie('d6');
			}
		}

		// Add defense d8 dice
		if(Vroom.isAreaClicked(this.addD8ToDefenseButton.pos, this.addD8ToDefenseButton.dim, false)) {
			if(this.addD8ToDefenseButton.cost <= player.xp){
				player.xp -= this.addD8ToDefenseButton.cost;
				player.ship.addDefenseDie('d8');
			}
		}



		// Add repair d4 dice
		if(Vroom.isAreaClicked(this.addD4ToRepairButton.pos, this.addD4ToRepairButton.dim, false)) {
			if(this.addD4ToRepairButton.cost <= player.xp){
				player.xp -= this.addD4ToRepairButton.cost;
				player.ship.addRepairDie('d4');
			}
		}

		// Add repair d6 dice
		if(Vroom.isAreaClicked(this.addD6ToRepairButton.pos, this.addD6ToRepairButton.dim, false)) {
			if(this.addD6ToRepairButton.cost <= player.xp){
				player.xp -= this.addD6ToRepairButton.cost;
				player.ship.addRepairDie('d6');
			}
		}

		// Add repair d8 dice
		if(Vroom.isAreaClicked(this.addD8ToRepairButton.pos, this.addD8ToRepairButton.dim, false)) {
			if(this.addD8ToRepairButton.cost <= player.xp){
				player.xp -= this.addD8ToRepairButton.cost;
				player.ship.addRepairDie('d8');
			}
		}



		// Add jump d4 dice
		if(Vroom.isAreaClicked(this.addD4ToJumpButton.pos, this.addD4ToJumpButton.dim, false)) {
			if(this.addD4ToJumpButton.cost <= player.xp){
				player.xp -= this.addD4ToJumpButton.cost;
				player.ship.addJumpDie('d4');
			}
		}

		// Add jump d6 dice
		if(Vroom.isAreaClicked(this.addD6ToJumpButton.pos, this.addD6ToJumpButton.dim, false)) {
			if(this.addD6ToJumpButton.cost <= player.xp){
				player.xp -= this.addD6ToJumpButton.cost;
				player.ship.addJumpDie('d6');
			}
		}

		// Add jump d8 dice
		if(Vroom.isAreaClicked(this.addD8ToJumpButton.pos, this.addD8ToJumpButton.dim, false)) {
			if(this.addD8ToJumpButton.cost <= player.xp){
				player.xp -= this.addD8ToJumpButton.cost;
				player.ship.addJumpDie('d8');
			}
		}



		// Repair button
		if(Vroom.isAreaClicked(this.repairButton.pos, this.repairButton.dim, false)) {
			if(this.repairButton.cost <= player.xp){
				player.xp -= this.repairButton.cost;
				activateStep(steps.REPAIR, 0);
			}
		}

		// Jump button
		if(Vroom.isAreaClicked(this.jumpButton.pos, this.jumpButton.dim, false)) {
			activateStep(steps.JUMP, 0);
		}
	}
};

// Render function. Draws all elements related to this module to screen.
xpScreen.render = function(camera) {
	if(this.visible) {
		Vroom.ctx.fillStyle = 'rgba(50, 50, 50, 0.95)';
		Vroom.ctx.fillRect(this.pos.x + this.margin, this.pos.y + this.margin, this.dim.width - (this.margin * 2), this.dim.height - (this.margin * 2));

		Vroom.ctx.fillStyle = '#fff';

		// Title
		Vroom.ctx.font = "25px helvetica";
		Vroom.ctx.textAlign = "left";
		Vroom.ctx.fillText('UPGRADE SHIP', this.contentPos.x, this.contentPos.y + 25);

		// After title
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.textAlign = "left";
		Vroom.ctx.fillText('You may spend xp on upgrading your ship', this.contentPos.x, this.contentPos.y + 50);

		// Available XP
		Vroom.ctx.textAlign = "right";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText('Available XP: ' + player.xp, this.contentPos.x + this.contentDim.width, this.contentPos.y + 25);



		// Add attack dice
		Vroom.ctx.textAlign = "left";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText('Add attack dice: ', this.contentPos.x, this.contentPos.y + 120);

		// Add d4 attack
		if(this.addD4ToAttackButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD4ToAttackButton.pos, this.addD4ToAttackButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD4ToAttackButton.pos.x, this.addD4ToAttackButton.pos.y, this.addD4ToAttackButton.dim.width, this.addD4ToAttackButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD4ToAttackButton.text, this.addD4ToAttackButton.pos.x + (this.addD4ToAttackButton.dim.width / 2), this.addD4ToAttackButton.pos.y + (this.addD4ToAttackButton.dim.height / 2) + 6);

		// Add d6 attack
		if(this.addD6ToAttackButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD6ToAttackButton.pos, this.addD6ToAttackButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD6ToAttackButton.pos.x, this.addD6ToAttackButton.pos.y, this.addD6ToAttackButton.dim.width, this.addD6ToAttackButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD6ToAttackButton.text, this.addD6ToAttackButton.pos.x + (this.addD6ToAttackButton.dim.width / 2), this.addD6ToAttackButton.pos.y + (this.addD6ToAttackButton.dim.height / 2) + 6);

		// Add d8 attack
		if(this.addD8ToAttackButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD8ToAttackButton.pos, this.addD8ToAttackButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD8ToAttackButton.pos.x, this.addD8ToAttackButton.pos.y, this.addD8ToAttackButton.dim.width, this.addD8ToAttackButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD8ToAttackButton.text, this.addD8ToAttackButton.pos.x + (this.addD8ToAttackButton.dim.width / 2), this.addD8ToAttackButton.pos.y + (this.addD8ToAttackButton.dim.height / 2) + 6);


		// Add defense dice
		Vroom.ctx.textAlign = "left";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText('Add defense dice: ', this.contentPos.x, this.contentPos.y + 190);

		// Add d4 defense
		if(this.addD4ToDefenseButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD4ToDefenseButton.pos, this.addD4ToDefenseButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD4ToDefenseButton.pos.x, this.addD4ToDefenseButton.pos.y, this.addD4ToDefenseButton.dim.width, this.addD4ToDefenseButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD4ToDefenseButton.text, this.addD4ToDefenseButton.pos.x + (this.addD4ToDefenseButton.dim.width / 2), this.addD4ToDefenseButton.pos.y + (this.addD4ToDefenseButton.dim.height / 2) + 6);

		// Add d6 defense
		if(this.addD6ToDefenseButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD6ToDefenseButton.pos, this.addD6ToDefenseButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD6ToDefenseButton.pos.x, this.addD6ToDefenseButton.pos.y, this.addD6ToDefenseButton.dim.width, this.addD6ToDefenseButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD6ToDefenseButton.text, this.addD6ToDefenseButton.pos.x + (this.addD6ToDefenseButton.dim.width / 2), this.addD6ToDefenseButton.pos.y + (this.addD6ToDefenseButton.dim.height / 2) + 6);

		// Add d8 defense
		if(this.addD8ToDefenseButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD8ToDefenseButton.pos, this.addD8ToDefenseButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD8ToDefenseButton.pos.x, this.addD8ToDefenseButton.pos.y, this.addD8ToDefenseButton.dim.width, this.addD8ToDefenseButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD8ToDefenseButton.text, this.addD8ToDefenseButton.pos.x + (this.addD8ToDefenseButton.dim.width / 2), this.addD8ToDefenseButton.pos.y + (this.addD8ToDefenseButton.dim.height / 2) + 6);



		// Add repair dice
		Vroom.ctx.textAlign = "left";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText('Add repair dice: ', this.contentPos.x, this.contentPos.y + 260);

		// Add d4 repair
		if(this.addD4ToRepairButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD4ToRepairButton.pos, this.addD4ToRepairButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD4ToRepairButton.pos.x, this.addD4ToRepairButton.pos.y, this.addD4ToRepairButton.dim.width, this.addD4ToRepairButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD4ToRepairButton.text, this.addD4ToRepairButton.pos.x + (this.addD4ToRepairButton.dim.width / 2), this.addD4ToRepairButton.pos.y + (this.addD4ToRepairButton.dim.height / 2) + 6);

		// Add d6 repair
		if(this.addD6ToRepairButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD6ToRepairButton.pos, this.addD6ToRepairButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD6ToRepairButton.pos.x, this.addD6ToRepairButton.pos.y, this.addD6ToRepairButton.dim.width, this.addD6ToRepairButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD6ToRepairButton.text, this.addD6ToRepairButton.pos.x + (this.addD6ToRepairButton.dim.width / 2), this.addD6ToRepairButton.pos.y + (this.addD6ToRepairButton.dim.height / 2) + 6);

		// Add d8 repair
		if(this.addD8ToRepairButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD8ToRepairButton.pos, this.addD8ToRepairButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD8ToRepairButton.pos.x, this.addD8ToRepairButton.pos.y, this.addD8ToRepairButton.dim.width, this.addD8ToRepairButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD8ToRepairButton.text, this.addD8ToRepairButton.pos.x + (this.addD8ToRepairButton.dim.width / 2), this.addD8ToRepairButton.pos.y + (this.addD8ToRepairButton.dim.height / 2) + 6);


		// Add jump dice
		Vroom.ctx.textAlign = "left";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText('Add jump dice: ', this.contentPos.x, this.contentPos.y + 330);

		// Add d4 jump
		if(this.addD4ToJumpButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD4ToJumpButton.pos, this.addD4ToJumpButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD4ToJumpButton.pos.x, this.addD4ToJumpButton.pos.y, this.addD4ToJumpButton.dim.width, this.addD4ToJumpButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD4ToJumpButton.text, this.addD4ToJumpButton.pos.x + (this.addD4ToJumpButton.dim.width / 2), this.addD4ToJumpButton.pos.y + (this.addD4ToJumpButton.dim.height / 2) + 6);

		// Add d6 jump
		if(this.addD6ToJumpButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD6ToJumpButton.pos, this.addD6ToJumpButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD6ToJumpButton.pos.x, this.addD6ToJumpButton.pos.y, this.addD6ToJumpButton.dim.width, this.addD6ToJumpButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD6ToJumpButton.text, this.addD6ToJumpButton.pos.x + (this.addD6ToJumpButton.dim.width / 2), this.addD6ToJumpButton.pos.y + (this.addD6ToJumpButton.dim.height / 2) + 6);

		// Add d8 jump
		if(this.addD8ToJumpButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.addD8ToJumpButton.pos, this.addD8ToJumpButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.addD8ToJumpButton.pos.x, this.addD8ToJumpButton.pos.y, this.addD8ToJumpButton.dim.width, this.addD8ToJumpButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.addD8ToJumpButton.text, this.addD8ToJumpButton.pos.x + (this.addD8ToJumpButton.dim.width / 2), this.addD8ToJumpButton.pos.y + (this.addD8ToJumpButton.dim.height / 2) + 6);



		// Jump button
		if(this.jumpButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.jumpButton.pos, this.jumpButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.jumpButton.pos.x, this.jumpButton.pos.y, this.jumpButton.dim.width, this.jumpButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.jumpButton.text, this.jumpButton.pos.x + (this.jumpButton.dim.width / 2), this.jumpButton.pos.y + (this.jumpButton.dim.height / 2) + 6);

		// Repair button
		if(this.repairButton.cost <= player.xp) {
			if(Vroom.isMouseOverArea(this.repairButton.pos, this.repairButton.dim, false)) {
				Vroom.ctx.fillStyle = '#A5A2A4';
			} else {
				Vroom.ctx.fillStyle = '#808080';
			}
		} else {
			Vroom.ctx.fillStyle = '#3A393A';
		}

		Vroom.ctx.fillRect(this.repairButton.pos.x, this.repairButton.pos.y, this.repairButton.dim.width, this.repairButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.repairButton.text, this.repairButton.pos.x + (this.repairButton.dim.width / 2), this.repairButton.pos.y + (this.repairButton.dim.height / 2) + 6);
	}
};

// Init call
xpScreen.init();




var progressBar = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
progressBar.init = function() {
	this.layer = 3;

	this.dim = {
		width: Vroom.dim.width - 200,
		height: 10,
	};

	this.updateBounds();

	this.pos = {
		x: 100,
		y: 50,
	};

	this.visible = true;

	this.currentTravelDistance = 0;

	// Register entity
	Vroom.registerEntity(progressBar);
};

// Update function. Handles all logic for objects related to this module.
progressBar.update = function(step) {
	if(this.visible) {
		if(this.currentTravelDistance !== gameSessionState.travelDistance) {
			this.currentTravelDistance += Vroom.lerpValue(step, this.currentTravelDistance, gameSessionState.travelDistance, 0.001);
		}
	}
};

// Render function. Draws all elements related to this module to screen.
progressBar.render = function(camera) {
	if(this.visible) {
		Vroom.ctx.fillStyle = '#564201';
		Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);

		Vroom.ctx.fillStyle = '#EFB308';
		Vroom.ctx.fillRect(this.pos.x, this.pos.y, (this.dim.width / gameSessionState.travelDistanceTotal) * this.currentTravelDistance, this.dim.height);
	}
};

// Init call
progressBar.init();



///////////////////////////////////////////////////////////////



var winLoseScreen = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
winLoseScreen.init = function() {
	this.layer = 5;

	this.dim = {
		width: Vroom.dim.width,
		height: Vroom.dim.height,
	};

	this.updateBounds();

	this.pos = {
		x: 0,
		y: 0,
	};

	this.visible = false;
	this.text = 'You won!';

	this.tryAgainButton = {
		pos: {
			x: Vroom.dim.width / 2 - 150,
			y: Vroom.dim.height / 2,
		},
		dim: {
			width: 300,
			height: 60,
		},
		text: 'Play again',
		cost: 0,
	};

	// Register entity
	Vroom.registerEntity(winLoseScreen);
};

// Update function. Handles all logic for objects related to this module.
winLoseScreen.update = function(step) {
	// Reset visible state
	this.visible = false;

	// Show in certain steps
	if(gameSessionState.currentStep === steps.WIN) {
		this.visible = true;
		this.text = 'You did it!';
	}

	if(gameSessionState.currentStep === steps.LOSE) {
		this.visible = true;
		this.text = 'You did not make it to the end...';
	}

	//Handle being clicked
	if(Vroom.isAreaClicked(this.tryAgainButton.pos, this.tryAgainButton.dim, false)) {
		restart();
	}
};

// Render function. Draws all elements related to this module to screen.
winLoseScreen.render = function(camera) {
	if(this.visible) {
		// Background
		if(gameSessionState.currentStep === steps.LOSE) {
			Vroom.ctx.fillStyle = '#530400';
		}

		if(gameSessionState.currentStep === steps.WIN) {
			Vroom.ctx.fillStyle = '#187113';
		}

		Vroom.ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);

		// Text
		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.text, Vroom.dim.width / 2, Vroom.dim.height / 3);

		// Button
		if(Vroom.isMouseOverArea(this.tryAgainButton.pos, this.tryAgainButton.dim, false)) {
			Vroom.ctx.fillStyle = '#A5A2A4';
		} else {
			Vroom.ctx.fillStyle = '#808080';
		}

		Vroom.ctx.fillRect(this.tryAgainButton.pos.x, this.tryAgainButton.pos.y, this.tryAgainButton.dim.width, this.tryAgainButton.dim.height);

		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "18px helvetica";
		Vroom.ctx.fillText(this.tryAgainButton.text, this.tryAgainButton.pos.x + (this.tryAgainButton.dim.width / 2), this.tryAgainButton.pos.y + (this.tryAgainButton.dim.height / 2) + 6);
	}
};

// Init call
winLoseScreen.init();




///////////////////////////////////////////////////////////////




var popupMessage = new VroomEntity(false);

// Init function for module. NOTE: default arguments are placeholders and need to be replaced or defined.
popupMessage.init = function() {
	this.layer = 3;

	this.dim = {
		width: 0,
		height: 0,
	};

	this.updateBounds();

	this.pos = {
		x: Vroom.dim.width / 2,
		y: Vroom.dim.height / 2,
	};

	this.visible = false;
	this.text = 'Placeholder';
	this.visibleDuration = 1500;
	this.visibleStart = Date.now();

	// Register entity
	Vroom.registerEntity(popupMessage);
};

// Update function. Handles all logic for objects related to this module.
popupMessage.update = function(step) {
	// Reset visible state

	// Hide in certain steps
	if(this.visible && Date.now() - this.visibleStart >= this.visibleDuration) {
		this.visible = false;
	}
};

popupMessage.display = function(text) {
	this.text = text;
	this.visible = true;
	this.visibleStart = Date.now();
};

// Render function. Draws all elements related to this module to screen.
popupMessage.render = function(camera) {
	if(this.visible) {
		Vroom.ctx.fillStyle = '#fff';
		Vroom.ctx.textAlign = "center";
		Vroom.ctx.font = "80px helvetica";
		Vroom.ctx.fillText(this.text, this.pos.x, this.pos.y);
	}
};

// Init call
popupMessage.init();