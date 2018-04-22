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
};

Vroom.mainUpdateLoopExtension = function() {
	// Update lastStep
	if(gameSessionState.lastStep !== gameSessionState.currentStep) {
		gameSessionState.lastStep = gameSessionState.currentStep;
	}
	
};