/**
 * js/ui/boardRenderer.js
 * Layer: PRESENTATION
 * Responsibility: Build and update the game board DOM.
 */

const BoardRenderer = (() => {

    // 2D array of tile DOM elements, indexed by [r][c]
    let _tiles = [];

    function render(level, gridMap) {
        const board     = document.getElementById('board');
        const container = document.getElementById('board-container');
        board.innerHTML = '';
        _tiles = [];

        const size          = level.size;
        const containerWidth = Math.min(window.innerWidth - 32, 400);
        const gap           = size > 8 ? 4 : 6;
        const tileSize      = Math.floor((containerWidth - (gap * (size - 1)) - 32) / size);
        const fontSize      = tileSize * 0.5;

        board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        board.style.gap = `${gap}px`;

        for (let r = 0; r < size; r++) {
            _tiles[r] = [];
            for (let c = 0; c < size; c++) {
                const tile = document.createElement('div');
                tile.className   = 'tile';
                tile.style.width  = `${tileSize}px`;
                tile.style.height = `${tileSize}px`;
                tile.style.fontSize = `${fontSize}px`;
                tile.innerText   = gridMap[r][c];
                tile.dataset.r   = r;
                tile.dataset.c   = c;

                // Attach input events — delegate to GameController
                tile.addEventListener('mousedown', () => GameController.startSelection(r, c));
                tile.addEventListener('mouseenter', () => GameController.continueSelection(r, c));
                tile.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    GameController.startSelection(r, c);
                });

                board.appendChild(tile);
                _tiles[r][c] = tile;
            }
        }

        GameController.attachEventListeners();

        // Build word list UI (learn mode only)
        const wordListEl        = document.getElementById('word-list');
        const wordListContainer = document.getElementById('word-list-container');
        const timerDisplay      = document.getElementById('timer-display');
        wordListEl.innerHTML    = '';

        if (level.mode === 'learn') {
            wordListContainer.style.display = 'flex';
            timerDisplay.classList.add('hidden');
            level.words.forEach(w => {
                const span = document.createElement('span');
                span.className = 'word-item bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-sm font-bold shadow-inner';
                span.id        = `word-${w.en}`;
                span.innerText = w.en;
                wordListEl.appendChild(span);
            });
        } else {
            wordListContainer.style.display = 'none';
            timerDisplay.classList.remove('hidden');
        }
    }

    function getTile(r, c) {
        return _tiles[r] && _tiles[r][c];
    }

    function updateSelectionVisuals(selectedCells) {
        // Clear old selection (not found tiles)
        _tiles.flat().forEach(t => {
            if (t && !t.classList.contains('found')) t.classList.remove('selected');
        });
        selectedCells.forEach(({ r, c }) => {
            const t = getTile(r, c);
            if (t && !t.classList.contains('found')) t.classList.add('selected');
        });
    }

    function clearSelection(selectedCells) {
        selectedCells.forEach(({ r, c }) => {
            const t = getTile(r, c);
            if (t) t.classList.remove('selected');
        });
    }

    function markWordFound(selectedCells, wordObj) {
        selectedCells.forEach(({ r, c }) => {
            const t = getTile(r, c);
            if (!t) return;
            t.classList.remove('selected', 'hinted');
            t.classList.add('found');
            t.dataset.wordEn = wordObj.en;
            t.dataset.wordVn = wordObj.vn;
        });
    }

    function hintTile(r, c) {
        const t = getTile(r, c);
        if (t) t.classList.add('hinted');
    }

    return { render, getTile, updateSelectionVisuals, clearSelection, markWordFound, hintTile };

})();