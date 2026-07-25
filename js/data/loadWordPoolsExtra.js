// Load extra vocabulary pool from JSON at runtime.
if (typeof WORD_POOLS !== 'object') {
    window.WORD_POOLS = {};
}
WORD_POOLS.EXTRA = WORD_POOLS.EXTRA || [];
WORD_POOLS.EXTRA_LOADING = true;
WORD_POOLS.EXTRA_LOADED = false;

const extraJsonUrl = 'js/data/tu_vung_hoan_thien_with_ipa.json';

function _setMenuLoadingState(isLoading, message) {
    const learnBtn = document.getElementById('btn-start-learn');
    const statusEl = document.getElementById('menu-extra-loading');

    if (learnBtn) {
        learnBtn.disabled = isLoading;
        learnBtn.classList.toggle('opacity-60', isLoading);
        learnBtn.classList.toggle('cursor-not-allowed', isLoading);
    }
    if (statusEl) {
        statusEl.innerText = message;
    }
}

_setMenuLoadingState(true, 'Đang tải thêm từ vựng... Learn sẽ sẵn sàng sau khi load xong.');

fetch(extraJsonUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load ${extraJsonUrl}: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data)) {
            throw new Error(`Expected array in ${extraJsonUrl}`);
        }
        WORD_POOLS.EXTRA = data.map(item => ({
            en: String(item.en || '').toUpperCase(),
            vn: String(item.vn || ''),
            ipa: String(item.ipa || ''),
            ex: String(item.ex || '')
        }));
        WORD_POOLS.EXTRA_LOADING = false;
        WORD_POOLS.EXTRA_LOADED = true;
        _setMenuLoadingState(false, `Từ vựng EXTRA đã sẵn sàng (${WORD_POOLS.EXTRA.length})`);
        document.dispatchEvent(new CustomEvent('WordPoolsExtraLoaded', {
            detail: { count: WORD_POOLS.EXTRA.length }
        }));
        console.log(`Loaded EXTRA_WORDS from ${extraJsonUrl}:`, WORD_POOLS.EXTRA.length);
    })
    .catch(error => {
        WORD_POOLS.EXTRA_LOADING = false;
        WORD_POOLS.EXTRA_LOADED = false;
        _setMenuLoadingState(true, 'Không thể tải từ vựng EXTRA. Learn sẽ bị vô hiệu hóa.');
        console.error('Could not load EXTRA word pool JSON:', error);
    });
