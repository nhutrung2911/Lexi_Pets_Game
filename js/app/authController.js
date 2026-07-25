/**
 * js/app/authController.js
 * Layer: APPLICATION
 * Responsibility: Auth use cases — login, register, logout, save/load.
 * Now connects to Supabase Backend.
 */

const AuthController = (() => {

    let _authMode = 'login'; // 'login' | 'register'

    // ── LOAD ──────────────────────────────────────────
    async function loadGame() {
        if (!window.supabaseClient) {
            _loadGuest();
            return;
        }

        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            await _fetchUserData(session.user);
        } else {
            _loadGuest();
        }

        // Listen for auth changes (e.g. login from another tab)
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await _fetchUserData(session.user);
            } else if (event === 'SIGNED_OUT') {
                _loadGuest();
            }
        });
    }

    function _loadGuest() {
        AuthState.currentUser = null;
        const guestData = StorageRepository.getGuestSave();
        if (guestData) {
            PlayerProfile.fromJSON(guestData);
        } else {
            PlayerProfile.reset();
        }
        UI.updateMenuUI();
    }

    async function _fetchUserData(user) {
        try {
            const { data: profile, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error || !profile) {
                console.error("Error fetching profile", error);
                _loadGuest();
                return;
            }

            AuthState.currentUser = profile.username;
            
            PlayerProfile.totalCoins = profile.coins;
            PlayerProfile.activePet = profile.active_pet;
            PlayerProfile.unlockedPets = typeof profile.unlocked_pets === 'string' ? JSON.parse(profile.unlocked_pets) : (profile.unlocked_pets || ['dog']);
            PlayerProfile.learnedWords = typeof profile.learned_words === 'string' ? JSON.parse(profile.learned_words) : (profile.learned_words || []);
            PlayerProfile.petExp = profile.pet_exp || 0;
            PlayerProfile.quests = typeof profile.quests === 'string' ? JSON.parse(profile.quests) : (profile.quests || []);

            UI.updateMenuUI();
            
            if (window.MultiplayerController) MultiplayerController.loginUser(profile.username);
        } catch (e) {
            console.error(e);
            _loadGuest();
        }
    }

    // ── SAVE ──────────────────────────────────────────
    async function saveGame() {
        if (!AuthState.currentUser || !window.supabaseClient) {
            StorageRepository.saveGuestSave(PlayerProfile.toJSON());
            return;
        }

        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        try {
            await supabaseClient.from('profiles').update({
                coins: PlayerProfile.totalCoins,
                active_pet: PlayerProfile.activePet,
                unlocked_pets: PlayerProfile.unlockedPets,
                learned_words: PlayerProfile.learnedWords,
                pet_exp: PlayerProfile.petExp,
                quests: PlayerProfile.quests
            }).eq('id', user.id);
        } catch(e) {
            console.error("Failed to sync to Supabase", e);
        }
    }

    // ── RESET ─────────────────────────────────────────
    async function resetSaveData() {
        if (!confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu (Vàng, thú cưng...) đang có không?")) return;

        if (AuthState.currentUser && window.supabaseClient) {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                await supabaseClient.from('profiles').update({
                    coins: 100,
                    active_pet: 'dog',
                    unlocked_pets: ['dog'],
                    learned_words: [],
                    pet_exp: 0,
                    quests: []
                }).eq('id', user.id);
            }
        } else {
            StorageRepository.removeGuestSave();
        }
        location.reload();
    }

    // ── AUTH MODE ─────────────────────────────────────
    function setAuthMode(mode) {
        _authMode = mode;
    }
    function getAuthMode() {
        return _authMode;
    }

    // ── SUBMIT ────────────────────────────────────────
    async function submit() {
        const username = document.getElementById('auth-username').value.trim();
        const password = document.getElementById('auth-password').value.trim();
        const errEl    = document.getElementById('auth-error');
        const btn      = document.getElementById('btn-auth-submit');

        if (!username || !password) {
            _showError(errEl, "Vui lòng nhập đủ thông tin!");
            return;
        }

        btn.disabled = true;
        btn.innerText = "Đang xử lý...";

        const email = username.includes('@') ? username : username + '@lexipets.app';

        if (_authMode === 'register') {
            await _register(email, username, password, errEl);
        } else {
            await _login(email, password, errEl);
        }

        btn.disabled = false;
        btn.innerText = _authMode === 'register' ? "Đăng Ký" : "Đăng Nhập";
    }

    async function _register(email, rawUsername, password, errEl) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
            });
            
            if (error) {
                _showError(errEl, error.message);
                return;
            }

            // Update username in profile
            if (data.user) {
                // Wait briefly for trigger to finish
                await new Promise(r => setTimeout(r, 500));
                
                // Add current guest data
                const guestData = PlayerProfile.toJSON();
                
                await supabaseClient.from('profiles').update({
                    username: rawUsername,
                    coins: guestData.totalCoins || 100,
                    active_pet: guestData.activePet || 'dog',
                    unlocked_pets: guestData.unlockedPets || ['dog'],
                    learned_words: guestData.learnedWords || [],
                    pet_exp: guestData.petExp || 0
                }).eq('id', data.user.id);
                
                await _fetchUserData(data.user);
            }

            UIHelpers.showToast(`Đăng ký thành công! Đã đồng bộ dữ liệu.`);
            UI.closeAuth();

        } catch (e) {
            _showError(errEl, "Lỗi kết nối!");
        }
    }

    async function _login(email, password, errEl) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) {
                _showError(errEl, "Sai tên đăng nhập hoặc mật khẩu.");
                return;
            }

            UI.closeAuth();
            UIHelpers.showToast(`Đăng nhập thành công!`);
            
            // _fetchUserData is called by onAuthStateChange event in loadGame automatically

        } catch (e) {
            _showError(errEl, "Lỗi kết nối!");
        }
    }

    // ── LOGOUT ────────────────────────────────────────
    async function logout(e) {
        e.stopPropagation();
        if (!confirm("Đăng xuất tài khoản?")) return;

        await saveGame();
        
        if (window.supabaseClient) {
            await supabaseClient.auth.signOut();
        }
        
        UIHelpers.showToast("Đã đăng xuất về tài khoản Guest.");
    }

    // ── HELPERS ───────────────────────────────────────
    function _showError(el, msg) {
        el.innerText = msg;
        el.classList.remove('hidden');
    }

    return {
        loadGame, saveGame, resetSaveData,
        setAuthMode, getAuthMode, submit, logout
    };

})();