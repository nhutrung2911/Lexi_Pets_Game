/**
 * js/ui/uiHelpers.js
 * Layer: PRESENTATION
 * Responsibility: Small reusable DOM utilities (toast, timer, etc.)
 */

const UIHelpers = (() => {

    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.innerText = msg;
        toast.classList.remove('show');
        void toast.offsetWidth; // force reflow to restart animation
        toast.classList.add('show');
    }

    function updateTimerDisplay(seconds) {
        const el = document.getElementById('timer-display');
        if (el) el.innerText = `${seconds}s`;
    }

    function pulseTimer() {
        const el = document.getElementById('timer-display');
        if (!el) return;
        el.classList.remove('text-rose-500');
        el.classList.add('text-green-500');
        el.style.transform = 'scale(1.5)';
        setTimeout(() => {
            el.classList.remove('text-green-500');
            el.classList.add('text-rose-500');
            el.style.transform = 'scale(1)';
        }, 300);
    }

    return { showToast, updateTimerDisplay, pulseTimer };

})();