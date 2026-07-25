/**
 * js/domain/boardEngine.js
 * Layer: DOMAIN
 * Responsibility: Pure logic for grid generation and word placement.
 * Returns data structures — never touches the DOM.
 */

const BoardEngine = (() => {

    const DIRECTIONS = [
        [0, 1],   // right
        [1, 0],   // down
        [1, 1],   // diagonal down-right
        [-1, 1],  // diagonal up-right
    ];

    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    /** Check if a word can be placed at position (r,c) in given direction */
    function _canPlace(word, r, c, dir, grid, size) {
        for (let i = 0; i < word.length; i++) {
            const rr = r + dir[0] * i;
            const cc = c + dir[1] * i;
            if (rr < 0 || rr >= size || cc < 0 || cc >= size) return false;
            if (grid[rr][cc] !== '' && grid[rr][cc] !== word[i]) return false;
        }
        return true;
    }

    /**
     * Generate a filled grid with all words placed.
     * @param {Array<{en: string}>} words
     * @param {number} size
     * @returns {{ grid: string[][], placements: Object }}
     *   placements: { WORD: [{r, c}, ...] } — index = letter position in original word
     */
    function generateGrid(words, size) {
        const grid = Array.from({ length: size }, () => Array(size).fill(''));
        const placements = {};

        for (const wordObj of words) {
            const word = wordObj.en;
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 200) {
                attempts++;
                const dir       = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
                const isReversed = Math.random() > 0.5;
                const toPlace   = isReversed ? word.split('').reverse().join('') : word;
                const row       = Math.floor(Math.random() * size);
                const col       = Math.floor(Math.random() * size);

                if (_canPlace(toPlace, row, col, dir, grid, size)) {
                    const path = [];
                    for (let i = 0; i < toPlace.length; i++) {
                        const rPos = row + dir[0] * i;
                        const cPos = col + dir[1] * i;
                        grid[rPos][cPos] = toPlace[i];
                        const originalIdx = isReversed ? (toPlace.length - 1 - i) : i;
                        path[originalIdx] = { r: rPos, c: cPos };
                    }
                    placements[word] = path;
                    placed = true;
                }
            }

            if (!placed) console.warn(`[BoardEngine] Could not place word: ${word}`);
        }

        // Fill empty cells with random letters
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === '') {
                    grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
                }
            }
        }

        return { grid, placements };
    }

    /**
     * Compute selected tile path from (startR, startC) to (r, c)
     * following strict straight-line rules.
     * Returns null if direction is invalid.
     * @returns {{ path: [{r,c}], dir: [number,number] } | null}
     */
    function computeSelectionPath(startR, startC, r, c, lockedDir) {
        const dr = r - startR;
        const dc = c - startC;

        if (dr === 0 && dc === 0) {
            return { path: [{ r: startR, c: startC }], dir: lockedDir };
        }

        let stepR, stepC;

        if (dr === 0)                         { stepR = 0;           stepC = Math.sign(dc); }
        else if (dc === 0)                    { stepR = Math.sign(dr); stepC = 0; }
        else if (Math.abs(dr) === Math.abs(dc)) { stepR = Math.sign(dr); stepC = Math.sign(dc); }
        else return null; // Invalid diagonal

        // Lock direction on first move; allow shrinking back
        if (lockedDir !== null) {
            const isForward  = lockedDir[0] === stepR && lockedDir[1] === stepC;
            const isBackward = lockedDir[0] === -stepR && lockedDir[1] === -stepC;
            if (!isForward && !isBackward) return null;
        }

        const newDir = lockedDir || [stepR, stepC];
        const steps  = Math.max(Math.abs(dr), Math.abs(dc));
        const path   = [];

        for (let i = 0; i <= steps; i++) {
            path.push({ r: startR + newDir[0] * i, c: startC + newDir[1] * i });
        }

        return { path, dir: newDir };
    }

    return { generateGrid, computeSelectionPath };

})();