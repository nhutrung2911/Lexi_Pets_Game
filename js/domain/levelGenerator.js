/**
 * js/domain/levelGenerator.js
 * Layer: DOMAIN
 * Responsibility: Pure business logic for generating level configs.
 * No DOM, no localStorage, no side effects.
 */

const LevelGenerator = (() => {

    /** Returns array of pool keys allowed for a given level index */
    function _getAllowedPools(levelIndex) {
        if (levelIndex < 3)  return ['A1'];
        if (levelIndex < 8)  return ['A1', 'A2'];
        if (levelIndex < 15) return ['A2', 'B1', 'EXTRA'];
        if (levelIndex < 25) return ['B1', 'B2', 'EXTRA'];
        if (levelIndex < 40) return ['B2', 'C1', 'EXTRA'];
        return ['B2', 'C1', 'C2', 'EXTRA'];
    }

    /** Fisher-Yates shuffle (pure, returns new array) */
    function _shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function _getAssignedWordsMap() {
        return PlayerProfile.assignedLevelWords || {};
    }

    function _getUsedWordSet() {
        const map = _getAssignedWordsMap();
        return new Set(Object.values(map).flat().map(word => String(word).toUpperCase()));
    }

    function _selectUniqueWords(levelIndex, combinedWords, wordCount) {
        const assigned = _getAssignedWordsMap()[levelIndex];
        if (Array.isArray(assigned) && assigned.length === wordCount) {
            const restored = assigned
                .map(en => combinedWords.find(w => w.en === String(en).toUpperCase()))
                .filter(Boolean);
            if (restored.length === assigned.length) {
                return restored;
            }
        }

        const usedSet = _getUsedWordSet();
        const unusedWords = combinedWords.filter(w => !usedSet.has(w.en));
        const source = unusedWords.length >= wordCount ? unusedWords : combinedWords;
        const shuffled = _shuffle(source);
        const selectedWords = shuffled.slice(0, wordCount);

        PlayerProfile.assignedLevelWords[levelIndex] = selectedWords.map(w => w.en);
        return selectedWords;
    }

    /**
     * Generate a level config for the given levelIndex.
     * @param {number} levelIndex
     * @returns {{ id, title, size, mode, words }}
     */
    function generate(levelIndex) {
        const allowedPools = _getAllowedPools(levelIndex);

        const combinedWords = allowedPools.reduce((acc, key) => {
            return acc.concat(WORD_POOLS[key] || []);
        }, []);

        const wordCount = Math.min(6 + Math.floor(levelIndex / 4), 10);
        const gridSize  = Math.min(8 + Math.floor(levelIndex / 5), 12);
        const selectedWords = _selectUniqueWords(levelIndex, combinedWords, wordCount);

        return {
            id: levelIndex + 1,
            title: `Learn - Lv ${levelIndex + 1}`,
            size: gridSize,
            mode: 'learn',
            words: selectedWords
        };
    }

    return { generate };

})();