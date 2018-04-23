////////////////////////////// GAME VARIABLES //////////////////////////////
var gameData = {};

// Game state
var gameState = {
	gameStarted: false,
};

// Constants
var steps = {};
steps.NONE = 'none';
steps.START = 'start';
steps.JUMP = 'jump';
steps.ENCOUNTER = 'encounter';
steps.ATTACK = 'attack';
steps.DEFEND = 'defend';
steps.STORE = 'store';
steps.REPAIR = 'repair';
steps.WIN = 'win';
steps.LOSE = 'lose';

stepChangeDelay = 1000;

// Game session state
var gameSessionState = {};

function initGameSessionState() {
	gameSessionState = {
		started: false,
		lastStep: steps.NONE,
		currentStep: steps.NONE,
		stepChangeInProgress: false,
		npcDead: false,
		diceRolledForStep: false,
		playerDiceResult: 0,
		npcDiceResult: 0,
		travelDistance: 0,
		travelDistanceTotal: 100,
	};
}

initGameSessionState();

function restart() {
	initGameSessionState();
	player.deleteShip();
	npc.deleteShip();
	activateStep(steps.START, 0);
}

function activateStep(stepName, delay) {
	delay = delay || 0;
	gameSessionState.stepChangeInProgress = true;
	setTimeout(function() {
		switch(stepName) {
			case steps.ENCOUNTER:
				Vroom.registerEntity(npc);
				break;

			case steps.REPAIR:
			case steps.JUMP:
			case steps.WIN:
				Vroom.deregisterEntity(npc);
				break;
		}

		// Reset step state
		gameSessionState.currentStep = stepName;
		gameSessionState.stepChangeInProgress = false;

		// Reset dice state
		gameSessionState.playerDiceResult = 0;
		gameSessionState.npcDiceResult = 0;
		gameSessionState.diceRolledForStep = false;
	}, delay);
}

Vroom.mainUpdateLoopExtension = function() {
	// Update lastStep
	if(gameSessionState.lastStep !== gameSessionState.currentStep) {
		// Trigger event
		player.onStepChange(gameSessionState.lastStep, gameSessionState.currentStep);
		npc.onStepChange(gameSessionState.lastStep, gameSessionState.currentStep);
		rollButton.onStepChange(gameSessionState.lastStep, gameSessionState.currentStep);

		// Push step state
		gameSessionState.lastStep = gameSessionState.currentStep;
	}
	
	// Check for win condition
	if(gameSessionState.currentStep !== steps.WIN && gameSessionState.travelDistance >= gameSessionState.travelDistanceTotal) {
		gameSessionState.travelDistance = gameSessionState.travelDistanceTotal;
		activateStep(steps.WIN, 0);
		console.log('YOU WIN!');
	}

	// Check for lose condition
	if(gameSessionState.currentStep !== steps.LOSE && player.ship && player.ship.health <= 0) {
		activateStep(steps.LOSE, 0);
		console.log('YOU LOSE!');
	}

	// Start combat if encounter travel is finished for both ships
	if(gameSessionState.currentStep === steps.ENCOUNTER) {
		if(player.pos.x == player.targetPos.x && npc.pos.x == npc.targetPos.x) {
			activateStep(steps.DEFEND);
		}
	}

	// Check if dice have been rolled and do step actions
	if(gameSessionState.currentStep !== steps.WIN && gameSessionState.currentStep !== steps.LOSE) {
		if(gameSessionState.diceRolledForStep && !gameSessionState.stepChangeInProgress && !player.ship.activeDicePoolRolling && !player.ship.activeDicePoolRolling) {
			
			switch(gameSessionState.currentStep) {
				case steps.ATTACK:
					npc.ship.applyDamage(gameSessionState.playerDiceResult - gameSessionState.npcDiceResult);
					if(gameSessionState.npcDead) {
						gameSessionState.npcDead = false;
						player.xp += 10;
						popupMessage.display('+10 XP');
						activateStep(steps.STORE, stepChangeDelay);
					} else {
						activateStep(steps.DEFEND, stepChangeDelay);
					}
					break;

				case steps.DEFEND:
					player.ship.applyDamage(gameSessionState.npcDiceResult - gameSessionState.playerDiceResult);
					activateStep(steps.ATTACK, stepChangeDelay);
					break;

				case steps.START:
				case steps.JUMP:
					gameSessionState.travelDistance += gameSessionState.playerDiceResult;
					if(gameSessionState.travelDistance < gameSessionState.travelDistanceTotal) {
						activateStep(steps.ENCOUNTER, stepChangeDelay);
						popupMessage.display('JUMPING ' + gameSessionState.playerDiceResult);
					}
					break;

				case steps.REPAIR:
					player.ship.repair(gameSessionState.playerDiceResult);
					activateStep(steps.JUMP, stepChangeDelay);
					break;
			}
		}
	}
};