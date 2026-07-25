/**
 * js/ui/audioManager.js
 * Responsibility: Play procedural sounds (Web Audio API) for interactions and events.
 */

const AudioManager = (() => {
    let audioCtx;

    function _init() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function _playTone(freq, type, duration, vol) {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    function playClick() {
        _init();
        _playTone(400, 'sine', 0.1, 0.1);
    }

    function playPop() {
        _init();
        _playTone(600, 'sine', 0.15, 0.2);
    }

    function playSuccess() {
        _init();
        _playTone(523.25, 'sine', 0.1, 0.2); // C5
        setTimeout(() => _playTone(659.25, 'sine', 0.1, 0.2), 100); // E5
        setTimeout(() => _playTone(783.99, 'sine', 0.2, 0.2), 200); // G5
    }

    function playError() {
        _init();
        _playTone(200, 'sawtooth', 0.2, 0.1);
        setTimeout(() => _playTone(150, 'sawtooth', 0.2, 0.1), 100);
    }

    function playWin() {
        _init();
        const notes = [
            { f: 523.25, d: 0.1 }, // C
            { f: 659.25, d: 0.1 }, // E
            { f: 783.99, d: 0.1 }, // G
            { f: 1046.50, d: 0.3 } // C6
        ];
        let delay = 0;
        notes.forEach(n => {
            setTimeout(() => _playTone(n.f, 'square', n.d, 0.1), delay);
            delay += 100;
        });
    }
    
    function playCoin() {
        _init();
        _playTone(1200, 'sine', 0.1, 0.1);
        setTimeout(() => _playTone(1600, 'sine', 0.2, 0.1), 50);
    }

    return {
        init: _init,
        playClick,
        playPop,
        playSuccess,
        playError,
        playWin,
        playCoin
    };
})();
