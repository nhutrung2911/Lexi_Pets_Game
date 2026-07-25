/**
 * js/ui/ui.js
 * Layer: PRESENTATION
 * Responsibility: Screen navigation and global UI state updates.
 * The single "UI facade" that controllers call to change what's visible.
 */

const UI = (() => {

    const SCREENS = ['menu', 'game', 'result', 'flashcard', 'store', 'collection', 'auth', 'leaderboard', 'friends', 'matchmaking'];

    // ── SCREEN MANAGEMENT ─────────────────────────────
    function showScreen(name) {
        SCREENS.forEach(id => {
            const el = document.getElementById(`screen-${id}`);
            if (el) el.classList.remove('active');
        });
        const target = document.getElementById(`screen-${name}`);
        if (target) target.classList.add('active');
    }

    function backToMenu() {
        clearInterval(GameSession.gameTimer);
        showScreen('menu');
        updateMenuUI();
    }

    // ── MENU ──────────────────────────────────────────
    function _renderActivePetMenu() {
        const charIconEl = document.getElementById('menu-pet-icon-large');
        const pet = PETS_DB.find(p => p.id === PlayerProfile.activePet);
        if (!pet) return;

        let cosmeticsHtml = '';
        if (PlayerProfile.activeCosmetics && PlayerProfile.activeCosmetics.length > 0 && window.COSMETICS_DB) {
            PlayerProfile.activeCosmetics.forEach(cId => {
                const c = COSMETICS_DB.find(x => x.id === cId);
                if (c) cosmeticsHtml += `<div class="absolute -top-4 -right-4 text-4xl animate-bounce" style="z-index: 10;">${c.icon}</div>`;
            });
        }

        if (charIconEl) {
            charIconEl.className = `fa-solid ${pet.icon} ${pet.color.replace('text-', 'text-')}`; 
            // In the DB color is e.g. text-orange-500
        }
        
        const charParent = document.getElementById('menu-character');
        if (charParent) {
            // clear old cosmetics before re-adding
            const oldCosmetics = charParent.querySelectorAll('.animate-bounce');
            oldCosmetics.forEach(e => e.remove());
            if (cosmeticsHtml) {
                charParent.insertAdjacentHTML('beforeend', cosmeticsHtml);
            }
        }
        
        const nameEl = document.getElementById('menu-pet-name');
        if (nameEl) nameEl.innerText = pet.name;
    }

    function updateMenuUI() {
        _setText('menu-coin-display',  PlayerProfile.totalCoins);
        _setText('store-coin-display', PlayerProfile.totalCoins);
        const gameCoin = document.getElementById('score-display');
        if (gameCoin) gameCoin.innerHTML = `${PlayerProfile.totalCoins} <i class="fa-solid fa-coins"></i>`;

        const lvlEl = document.getElementById('menu-level-indicator');
        if (lvlEl) lvlEl.innerText = `Lv ${PlayerProfile.currentLearnLevelIndex + 1}`;

        _setText('menu-word-status', _getWordUsageText());

        // Update User Name
        const userNameEl = document.getElementById('menu-user-name');
        if (userNameEl) {
            userNameEl.innerText = AuthState.currentUser || 'Guest';
        }

        // Update Pet EXP
        const petInfo = PETS_DB.find(p => p.id === PlayerProfile.activePet);
        _renderActivePetMenu();
        if (petInfo) {
            const exp = PlayerProfile.petExp || 0;
            let petLevel = 1;
            let currentLevelExp = 0;
            let expForNext = 100;

            // Simple level curve: 100, 200, 300...
            let remainingExp = exp;
            while(remainingExp >= expForNext) {
                remainingExp -= expForNext;
                petLevel++;
                expForNext = petLevel * 100;
            }
            
            _setText('menu-pet-level', petLevel);
            
            // Also update the user's level in the top left
            _setText('menu-user-level', petLevel);

            _setText('menu-pet-exp-text', `${remainingExp} / ${expForNext}`);

            const expPercent = Math.min(100, (remainingExp / expForNext) * 100);
            const expBar = document.getElementById('menu-pet-exp-bar');
            if (expBar) expBar.style.width = `${expPercent}%`;
        }

        if (window.SocialController) {
            SocialController.loadMiniLeaderboard();
        }

        _updateAuthButton();
    }

    function _getWordUsageText() {
        const assignedWords = PlayerProfile.assignedLevelWords || {};
        const usedCount = Object.values(assignedWords).flat().length;
        const extraReady = Boolean(WORD_POOLS.EXTRA_LOADED);
        const extraLabel = extraReady ? ` • EXTRA sẵn sàng (${WORD_POOLS.EXTRA.length})` : '';
        return `Từ đã gán: ${usedCount}${extraLabel}`;
    }

    function _updateAuthButton() {
        const btn = document.getElementById('auth-status-btn');
        if (!btn) return;

        if (AuthState.currentUser) {
            btn.innerHTML = `
                <i class="fa-solid fa-user-check text-primary"></i>
                <span class="text-primary font-bold">${AuthState.currentUser}</span>
                <button onclick="AuthController.logout(event)" class="ml-2 bg-slate-100 text-rose-500 rounded-full w-7 h-7 flex items-center justify-center shadow-inner hover:bg-slate-200 active:scale-90 transition">
                    <i class="fa-solid fa-right-from-bracket text-[10px]"></i>
                </button>`;
        } else {
            btn.innerHTML = `<i class="fa-solid fa-user"></i> Guest / Login`;
        }
    }

    // ── GAME SCREEN ───────────────────────────────────
    function renderGameHeader(level, bonusTime) {
        const petInfo = PETS_DB.find(p => p.id === PlayerProfile.activePet);
        const skillBtn = document.getElementById('btn-skill');

        document.getElementById('game-title').innerText = level.title;
        document.getElementById('score-display').innerHTML = `${PlayerProfile.totalCoins} <i class="fa-solid fa-coins"></i>`;

        if (skillBtn) {
            skillBtn.disabled = false;
            skillBtn.innerHTML = `<i class="fa-solid ${petInfo.icon} text-xl"></i><span class="text-[10px] font-bold uppercase">Skill</span>`;
        }
    }

    function markWordInList(wordEn) {
        const badge = document.getElementById(`word-${wordEn}`);
        if (!badge) return;
        badge.classList.remove('bg-slate-100', 'text-slate-500');
        badge.classList.add('bg-green-100', 'text-green-600', 'found');
        badge.innerHTML = `${wordEn} <i class="fa-solid fa-check ml-1"></i>`;
    }

    function markSkillUsed() {
        const btn = document.getElementById('btn-skill');
        if (!btn) return;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-check text-xl"></i><span class="text-[10px] font-bold uppercase">Đã dùng</span>';
    }

    // ── RESULT SCREEN ─────────────────────────────────
    function showResultScreen(isVictory, level) {
        showScreen('result');

        const actionBtn = document.getElementById('btn-result-action');
        const nextBtn   = document.getElementById('btn-result-next');

        if (isVictory) {
            _setText('result-title', 'Level Cleared!');
            _setText('result-desc',  'Awesome job!');

            if (window.confetti) {
                window.confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            if (level.mode === 'learn') {
                actionBtn.innerText  = "Ôn Tập Flashcard";
                actionBtn.onclick    = FlashcardController.open;
                actionBtn.style.display = 'block';

                nextBtn.style.display = 'flex';
                nextBtn.onclick = () => {
                    PlayerProfile.currentLearnLevelIndex++;
                    AuthController.saveGame();
                    showScreen('menu');
                    GameController.startGame('learn');
                };
            } else {
                actionBtn.innerText     = "Chơi Lại";
                actionBtn.onclick       = () => { showScreen('menu'); GameController.startGame('challenge'); };
                actionBtn.style.display = 'block';
                nextBtn.style.display   = 'none';
            }
        } else {
            _setText('result-title', "Time's Up!");
            _setText('result-desc',  "Try to be faster next time.");
            actionBtn.innerText     = "Chơi Lại";
            actionBtn.onclick       = () => { showScreen('menu'); GameController.startGame('challenge'); };
            actionBtn.style.display = 'block';
            nextBtn.style.display   = 'none';
        }
    }

    // ── AUTH ──────────────────────────────────────────
    function openAuth() {
        if (AuthState.currentUser) return;
        showScreen('auth');
        switchAuthTab('login');
    }

    function closeAuth() {
        showScreen('menu');
        document.getElementById('auth-error').classList.add('hidden');
    }

    function switchAuthTab(mode) {
        AuthController.setAuthMode(mode);

        const tabLogin  = document.getElementById('tab-login');
        const tabReg    = document.getElementById('tab-register');
        const title     = document.getElementById('auth-title');
        const btnSubmit = document.getElementById('btn-auth-submit');
        const err       = document.getElementById('auth-error');
        err.classList.add('hidden');

        if (mode === 'login') {
            tabLogin.className  = "flex-1 py-2 rounded-lg font-bold text-blue-600 bg-white shadow-sm transition";
            tabReg.className    = "flex-1 py-2 rounded-lg font-bold text-slate-400 transition";
            title.innerText     = "Đăng Nhập";
            btnSubmit.innerText = "Đăng Nhập";
            btnSubmit.className = "w-full py-4 bg-blue-500 text-white font-bold rounded-2xl shadow-[0_4px_0_#2563eb] active:translate-y-1 active:shadow-none transition";
        } else {
            tabReg.className    = "flex-1 py-2 rounded-lg font-bold text-green-600 bg-white shadow-sm transition";
            tabLogin.className  = "flex-1 py-2 rounded-lg font-bold text-slate-400 transition";
            title.innerText     = "Đăng Ký";
            btnSubmit.innerText = "Tạo Tài Khoản";
            btnSubmit.className = "w-full py-4 bg-green-500 text-white font-bold rounded-2xl shadow-[0_4px_0_#22c55e] active:translate-y-1 active:shadow-none transition";
        }
    }

    // ── STORE / COLLECTION ────────────────────────────
    function openStore() {
        showScreen('store');
        updateMenuUI();
        StoreRenderer.render();
        StoreRenderer.renderItems();
        switchStoreTab('pets');
    }

    function switchStoreTab(tab) {
        const tabPetsBtn = document.getElementById('tab-store-pets');
        const tabItemsBtn = document.getElementById('tab-store-items');
        const tabCosmeticsBtn = document.getElementById('tab-store-cosmetics');
        
        const listPets = document.getElementById('store-list');
        const listItems = document.getElementById('store-items-list');
        const listCosmetics = document.getElementById('store-cosmetics-list');

        // Reset all
        tabPetsBtn.className = "flex-1 py-3 font-bold text-slate-400 bg-white transition rounded-xl";
        tabItemsBtn.className = "flex-1 py-3 font-bold text-slate-400 bg-white transition rounded-xl";
        tabCosmeticsBtn.className = "flex-1 py-3 font-bold text-slate-400 bg-white transition rounded-xl";
        
        listPets.style.display = 'none';
        listItems.style.display = 'none';
        listCosmetics.style.display = 'none';

        if (tab === 'pets') {
            tabPetsBtn.className = "flex-1 py-3 font-bold text-amber-600 bg-amber-100 transition rounded-xl";
            listPets.style.display = 'flex';
        } else if (tab === 'items') {
            tabItemsBtn.className = "flex-1 py-3 font-bold text-amber-600 bg-amber-100 transition rounded-xl";
            listItems.style.display = 'flex';
        } else if (tab === 'cosmetics') {
            tabCosmeticsBtn.className = "flex-1 py-3 font-bold text-amber-600 bg-amber-100 transition rounded-xl";
            listCosmetics.style.display = 'flex';
        }
    }

    function openCollection() {
        showScreen('collection');
        switchCollectionTab('pets');
    }

    function switchCollectionTab(tab) {
        const tabPetsBtn = document.getElementById('tab-pets');
        const tabWordsBtn = document.getElementById('tab-words');
        const viewPets   = document.getElementById('collection-pets-view');
        const viewWords  = document.getElementById('collection-words-view');

        if (tab === 'pets') {
            tabPetsBtn.className  = "flex-1 py-3 font-bold text-teal-600 bg-teal-100 transition";
            tabWordsBtn.className = "flex-1 py-3 font-bold text-slate-400 bg-white transition";
            viewPets.classList.remove('hidden');
            viewWords.classList.add('hidden');
            viewPets.classList.add('grid');
            CollectionRenderer.renderPets();
        } else {
            tabWordsBtn.className = "flex-1 py-3 font-bold text-teal-600 bg-teal-100 transition";
            tabPetsBtn.className  = "flex-1 py-3 font-bold text-slate-400 bg-white transition";
            viewWords.classList.remove('hidden');
            viewPets.classList.add('hidden');
            viewWords.classList.add('flex');
            CollectionRenderer.renderWords();
        }
    }

    // ── UTILITY ───────────────────────────────────────
    function _setText(id, val) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    }

    return {
        showScreen, backToMenu, updateMenuUI, renderGameHeader,
        markWordInList, markSkillUsed, showResultScreen,
        openAuth, closeAuth, switchAuthTab,
        openStore, switchStoreTab, openCollection, switchCollectionTab,
    };

})();