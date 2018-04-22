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
steps.REPAIR = 'repair';
steps.WIN = 'win';
steps.LOSE = 'lose';

// Game session state
var gameSessionState = {
	started: false,
	lastStep: steps.NONE,
	currentStep: steps.START,
	travelDistance: 0,
	travelDistanceTotal: 100,
};

Vroom.mainUpdateLoopExtension = function() {
	// Update lastStep
	if(gameSessionState.lastStep !== gameSessionState.currentStep) {
		// Trigger event
		player.onStepChange(gameSessionState.lastStep, gameSessionState.currentStep);
		npc.onStepChange(gameSessionState.lastStep, gameSessionState.currentStep);

		// Push step state
		gameSessionState.lastStep = gameSessionState.currentStep;
	}
	
	// Check for win condition
	if(gameSessionState.travelDistance >= gameSessionState.travelDistanceTotal) {
		gameSessionState.travelDistance = gameSessionState.travelDistanceTotal;
		gameSessionState.currentStep = steps.WIN;
	}


};