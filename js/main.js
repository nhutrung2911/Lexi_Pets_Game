/**
 * js/main.js
 * Entry point — runs after all scripts are loaded.
 * Responsibility: Bootstrap the app (load data, render initial UI).
 */

document.addEventListener('DOMContentLoaded', () => {
    AuthController.loadGame();
    UI.updateMenuUI();
    UI.showScreen('menu');

    // Global click sound for buttons
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (target && !target.classList.contains('pointer-events-none')) {
            AudioManager.playClick();
        }
    });
});