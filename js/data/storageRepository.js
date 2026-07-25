/**
 * js/data/storageRepository.js
 * Layer: DATA
 * Responsibility: All reads/writes to localStorage.
 * Application layer never touches localStorage directly.
 */

const StorageRepository = (() => {

    const KEYS = {
        USERS_DB:     'lexipets_users_db',
        GUEST_SAVE:   'lexipets_guest_save',
        SESSION:      'lexipets_session',
    };

    function getUsersDB() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.USERS_DB)) || {};
        } catch { return {}; }
    }

    function saveUsersDB(db) {
        localStorage.setItem(KEYS.USERS_DB, JSON.stringify(db));
    }

    function getGuestSave() {
        try {
            return JSON.parse(localStorage.getItem(KEYS.GUEST_SAVE)) || null;
        } catch { return null; }
    }

    function saveGuestSave(data) {
        localStorage.setItem(KEYS.GUEST_SAVE, JSON.stringify(data));
    }

    function removeGuestSave() {
        localStorage.removeItem(KEYS.GUEST_SAVE);
    }

    function getSession() {
        return localStorage.getItem(KEYS.SESSION) || null;
    }

    function saveSession(username) {
        localStorage.setItem(KEYS.SESSION, username);
    }

    function removeSession() {
        localStorage.removeItem(KEYS.SESSION);
    }

    return {
        getUsersDB,
        saveUsersDB,
        getGuestSave,
        saveGuestSave,
        removeGuestSave,
        getSession,
        saveSession,
        removeSession,
    };

})();