/**
 * js/app/flashcardController.js
 * Layer: APPLICATION
 * Responsibility: Flashcard review use cases.
 */

const FlashcardController = (() => {

    function open() {
        FlashcardState.reset();
        UI.showScreen('flashcard');
        _render();
    }

    function _render() {
        const level = GameSession.currentLevel;
        if (!level || !level.words) return;

        const word   = level.words[FlashcardState.index];
        const total  = level.words.length;
        const isLast = FlashcardState.index === total - 1;

        document.getElementById('fc-current').innerText = FlashcardState.index + 1;
        document.getElementById('fc-total').innerText   = total;
        document.getElementById('fc-word').innerText    = word.en;
        document.getElementById('fc-ipa').innerText     = word.ipa  || '';
        document.getElementById('fc-vn').innerText      = word.vn;
        document.getElementById('fc-ex').innerText      = word.ex   || '';

        document.getElementById('flashcard-inner').classList.remove('flipped');

        const prevBtn = document.getElementById('btn-fc-prev');
        const nextBtn = document.getElementById('btn-fc-next');

        // Prev button
        if (FlashcardState.index === 0) {
            prevBtn.classList.add('opacity-50', 'pointer-events-none');
        } else {
            prevBtn.classList.remove('opacity-50', 'pointer-events-none');
        }

        // Next / Finish button
        if (isLast) {
            nextBtn.innerText   = "Màn Tiếp Theo";
            nextBtn.className   = "flex-1 py-3 bg-green-500 text-white font-bold rounded-2xl shadow-[0_4px_0_#22c55e] active:translate-y-1 active:shadow-none transition";
            nextBtn.onclick     = _goToNextLevel;
        } else {
            nextBtn.innerText   = "Next";
            nextBtn.className   = "flex-1 py-3 bg-indigo-500 text-white font-bold rounded-2xl shadow-[0_4px_0_#4338ca] active:translate-y-1 active:shadow-none transition";
            nextBtn.onclick     = next;
        }
    }

    function flip() {
        document.getElementById('flashcard-inner').classList.toggle('flipped');
    }

    function next() {
        const total = GameSession.currentLevel?.words?.length || 0;
        if (FlashcardState.index < total - 1) {
            FlashcardState.index++;
            _render();
        }
    }

    function prev() {
        if (FlashcardState.index > 0) {
            FlashcardState.index--;
            _render();
        }
    }

    function playAudio(e) {
        e.stopPropagation();
        const text = document.getElementById('fc-word').innerText;
        const utt  = new SpeechSynthesisUtterance(text);
        utt.lang   = 'en-US';
        window.speechSynthesis.speak(utt);
    }

    function _goToNextLevel() {
        PlayerProfile.currentLearnLevelIndex++;
        AuthController.saveGame();
        UI.showScreen('menu');  // briefly hide flashcard
        GameController.startGame('learn');
    }

    return { open, flip, next, prev, playAudio };

})();