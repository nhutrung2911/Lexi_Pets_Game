/**
 * js/app/gameController.js
 * Layer: APPLICATION
 * Responsibility: Game use cases — start, input handling, word found, end game.
 * Orchestrates Domain logic → updates State → calls UI renders.
 */

const GameController = (() => {

    // ── START GAME ────────────────────────────────────
    function startGame(mode, opponent = null, roomId = null) {
        GameSession.reset();
        InputState.reset();

        if (mode === 'learn' && PlayerProfile.currentLearnLevelIndex >= 8 && !WORD_POOLS.EXTRA_LOADED) {
            UIHelpers.showToast('Đang tải từ vựng EXTRA, vui lòng chờ một chút.');
            return;
        }

        const level = mode === 'learn'
            ? LevelGenerator.generate(PlayerProfile.currentLearnLevelIndex)
            : CHALLENGE_LEVEL;

        GameSession.currentLevel = level;
        GameSession.isPvP = (opponent !== null);

        // Bonus time for Cat pet in challenge mode
        const bonusTime = (mode === 'challenge' && PlayerProfile.activePet === 'cat') ? 5 : 0;

        // Generate board
        const { grid, placements } = BoardEngine.generateGrid(level.words, level.size);
        GameSession.gridMap    = grid;
        GameSession.placements = placements;

        // Render
        BoardRenderer.render(level, grid);
        UI.showScreen('game');
        UI.renderGameHeader(level, bonusTime);

        // Start timer if challenge
        if (mode === 'challenge') {
            GameSession.timeLeft = level.timer + bonusTime;
            _startTimer();
        }
    }

    function _startTimer() {
        UIHelpers.updateTimerDisplay(GameSession.timeLeft);
        GameSession.gameTimer = setInterval(() => {
            GameSession.timeLeft--;
            UIHelpers.updateTimerDisplay(GameSession.timeLeft);
            if (GameSession.timeLeft <= 0) endGame(false);
        }, 1000);
    }

    // ── INPUT: SELECTION ──────────────────────────────
    function startSelection(r, c) {
        InputState.isSelecting   = true;
        InputState.selectedCells = [{ r, c }];
        InputState.startR        = r;
        InputState.startC        = c;
        InputState.lockedDir     = null;
        AudioManager.playClick();
        BoardRenderer.updateSelectionVisuals(InputState.selectedCells);
    }

    function continueSelection(r, c) {
        if (!InputState.isSelecting) return;

        const result = BoardEngine.computeSelectionPath(
            InputState.startR, InputState.startC, r, c, InputState.lockedDir
        );

        if (!result) return; // invalid direction, ignore
        
        // Play pop sound if the selection length changed
        if (InputState.selectedCells.length !== result.path.length) {
            AudioManager.playPop();
        }

        InputState.lockedDir     = result.dir;
        InputState.selectedCells = result.path;
        BoardRenderer.updateSelectionVisuals(InputState.selectedCells);
    }

    function endSelection() {
        if (!InputState.isSelecting) return;
        InputState.isSelecting = false;

        const selected  = InputState.selectedCells.map(({ r, c }) => GameSession.gridMap[r][c]).join('');
        const reversed  = selected.split('').reverse().join('');
        const level     = GameSession.currentLevel;

        const found = level.words.find(
            w => (w.en === selected || w.en === reversed) && !GameSession.foundWords.includes(w.en)
        );

        if (found) {
            AudioManager.playSuccess();
            _handleWordFound(found);
        } else {
            AudioManager.playError();
            BoardRenderer.clearSelection(InputState.selectedCells);
            // Optionally add a shake effect here
            const cells = InputState.selectedCells;
            cells.forEach(cell => {
                const el = document.querySelector(`.tile[data-r="${cell.r}"][data-c="${cell.c}"]`);
                if(el) {
                    el.classList.add('shake-error');
                    setTimeout(() => el.classList.remove('shake-error'), 400);
                }
            });
        }

        InputState.reset();
    }

    function handleTouchMove(e) {
        if (!InputState.isSelecting) return;
        e.preventDefault();
        const touch = e.touches[0];
        const el    = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && el.classList.contains('tile')) {
            continueSelection(parseInt(el.dataset.r), parseInt(el.dataset.c));
        }
    }

    // ── WORD FOUND ────────────────────────────────────
    function _handleWordFound(wordObj) {
        BoardRenderer.markWordFound(InputState.selectedCells, wordObj);

        GameSession.foundWords.push(wordObj.en);
        GameSession.wordsFoundCount++;

        // Give EXP to pet
        PlayerProfile.petExp = (PlayerProfile.petExp || 0) + 15; // 15 exp per word

        const level = GameSession.currentLevel;

        if (level.mode === 'learn') {
            UI.markWordInList(wordObj.en);
            UIHelpers.showToast(`+15 EXP | ${wordObj.en}: ${wordObj.vn}`);
        } else {
            _handleChallengeBonus();
            UIHelpers.showToast(`+15 EXP`);
        }

        if (GameSession.isPvP && window.MultiplayerController) {
            MultiplayerController.sendScoreUpdate(GameSession.wordsFoundCount * 10);
        }

        if (window.QuestController) QuestController.updateProgress('find_words', 1);

        if (GameSession.wordsFoundCount === level.words.length) {
            setTimeout(() => endGame(true), 500);
        }
    }

    function _handleChallengeBonus() {
        GameSession.timeLeft += 5;
        UIHelpers.pulseTimer();
        UIHelpers.updateTimerDisplay(GameSession.timeLeft);
    }

    function usePetSkill() {
        if (GameSession.skillUsed || !GameSession.currentLevel) return;

        if (PlayerProfile.activePet !== 'owl') {
            UIHelpers.showToast("Pet này chỉ có kỹ năng Bị động!");
            return;
        }

        const targetWord = GameSession.currentLevel.words.find(
            w => !GameSession.foundWords.includes(w.en)
        );
        if (!targetWord) return;

        const path  = GameSession.placements[targetWord.en];
        if (!path || path.length === 0) return;

        AudioManager.playSuccess();
        BoardRenderer.hintTile(path[0].r, path[0].c);
        GameSession.skillUsed = true;
        UI.markSkillUsed();
    }

    // ── END GAME ──────────────────────────────────────
    function endGame(isVictory) {
        clearInterval(GameSession.gameTimer);
        _removeEventListeners();

        if (isVictory) {
            AudioManager.playWin();
            if (window.confetti) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#4ade80', '#facc15', '#3b82f6', '#ec4899']
                });
            }

            let baseReward = GameSession.currentLevel.mode === 'learn' ? 50 : 100;
            if (PlayerProfile.activePet === 'dragon') baseReward = Math.floor(baseReward * 1.2);

            PlayerProfile.totalCoins += baseReward;

            // Add newly learned words (avoid duplicates)
            GameSession.currentLevel.words.forEach(w => {
                if (!PlayerProfile.learnedWords.some(lw => lw.en === w.en)) {
                    PlayerProfile.learnedWords.push({ en: w.en, vn: w.vn, ipa: w.ipa });
                }
            });

            AuthController.saveGame();
        }

        if (GameSession.isPvP && window.MultiplayerController) {
            MultiplayerController.sendMatchEnd(GameSession.wordsFoundCount * 10);
            if (window.QuestController) QuestController.updateProgress('play_pvp', 1);
        }

        UI.updateMenuUI();
        UI.showResultScreen(isVictory, GameSession.currentLevel);
    }

    // ── EVENT LISTENERS ───────────────────────────────
    function attachEventListeners() {
        document.addEventListener('mouseup',    endSelection);
        document.addEventListener('touchend',   endSelection);
        document.addEventListener('touchmove',  handleTouchMove, { passive: false });
    }

    function _removeEventListeners() {
        document.removeEventListener('mouseup',   endSelection);
        document.removeEventListener('touchend',  endSelection);
        document.removeEventListener('touchmove', handleTouchMove);
    }

    return {
        startGame,
        startSelection,
        continueSelection,
        endSelection,
        handleTouchMove,
        usePetSkill,
        endGame,
        attachEventListeners,
    };

})();