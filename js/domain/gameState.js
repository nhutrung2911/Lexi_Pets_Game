/**
 * js/domain/gameState.js
 * Layer: DOMAIN
 * Responsibility: Single source of truth for all runtime state.
 * No logic — just structured state containers.
 */

/** Persistent player profile (saved to localStorage) */
const PlayerProfile = {
    totalCoins:            300,
    learnedWords:          [],   // [{ en, vn, ipa }]
    assignedLevelWords:    {},   // { [levelIndex]: [EN_WORD] }
    unlockedPets:          ['owl'],
    activePet:             'owl',
    currentLearnLevelIndex: 0,
    petExp:                0,
    inventory:             [], // [{itemId, quantity}]
    quests:                [], // [{id, type, target, progress, reward, isClaimed}]
    activeCosmetics:       [], // ['hat_1']

    /** Serialize to plain object for storage */
    toJSON() {
        return {
            totalCoins:             this.totalCoins,
            learnedWords:           this.learnedWords,
            assignedLevelWords:     this.assignedLevelWords,
            unlockedPets:           this.unlockedPets,
            activePet:              this.activePet,
            currentLearnLevelIndex: this.currentLearnLevelIndex,
            petExp:                 this.petExp,
            inventory:              this.inventory,
            quests:                 this.quests,
            activeCosmetics:        this.activeCosmetics
        };
    },

    /** Restore from stored object */
    fromJSON(data) {
        if (!data) return;
        if (data.totalCoins             !== undefined) this.totalCoins             = data.totalCoins;
        if (data.learnedWords           !== undefined) this.learnedWords           = data.learnedWords;
        // backward compat: old key was learnedWordsGlobal
        if (data.learnedWordsGlobal     !== undefined) this.learnedWords           = data.learnedWordsGlobal;
        if (data.assignedLevelWords    !== undefined) this.assignedLevelWords    = data.assignedLevelWords;
        if (data.unlockedPets           !== undefined) this.unlockedPets           = data.unlockedPets;
        if (data.activePet              !== undefined) this.activePet              = data.activePet;
        if (data.currentLearnLevelIndex !== undefined) this.currentLearnLevelIndex = data.currentLearnLevelIndex;
        if (data.petExp                 !== undefined) this.petExp                 = data.petExp;
        if (data.inventory              !== undefined) this.inventory              = data.inventory;
        if (data.quests                 !== undefined) this.quests                 = data.quests;
        if (data.activeCosmetics        !== undefined) this.activeCosmetics        = data.activeCosmetics;
    },

    reset() {
        this.totalCoins             = 300;
        this.learnedWords           = [];
        this.assignedLevelWords     = {};
        this.unlockedPets           = ['owl'];
        this.activePet              = 'owl';
        this.currentLearnLevelIndex = 0;
        this.petExp                 = 0;
        this.inventory              = [];
        this.quests                 = [];
        this.activeCosmetics        = [];
    }
};

/** Session info (who is logged in) */
const AuthState = {
    currentUser: null,   // null = guest
    usersDB:     {},
};

/** Live game session (reset on each startGame) */
const GameSession = {
    currentLevel:   null,
    gridMap:        [],
    placements:     {},    // { WORD: [{r,c},...] }
    foundWords:     [],    // [string]
    wordsFoundCount: 0,
    skillUsed:      false,
    gameTimer:      null,
    timeLeft:       0,

    reset() {
        this.currentLevel    = null;
        this.gridMap         = [];
        this.placements      = {};
        this.foundWords      = [];
        this.wordsFoundCount = 0;
        this.skillUsed       = false;
        clearInterval(this.gameTimer);
        this.gameTimer       = null;
        this.timeLeft        = 0;
    }
};

/** Input tracking during board interaction */
const InputState = {
    isSelecting:  false,
    selectedCells: [],  // [{r, c}]
    startR:       -1,
    startC:       -1,
    lockedDir:    null, // [dr, dc] or null

    reset() {
        this.isSelecting   = false;
        this.selectedCells = [];
        this.startR        = -1;
        this.startC        = -1;
        this.lockedDir     = null;
    }
};

/** Flashcard review session */
const FlashcardState = {
    index: 0,
    reset() { this.index = 0; }
};