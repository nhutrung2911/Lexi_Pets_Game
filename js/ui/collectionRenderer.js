/**
 * js/ui/collectionRenderer.js
 * Layer: PRESENTATION
 * Responsibility: Render the pets & words collection views.
 */

const CollectionRenderer = (() => {

    function renderPets() {
        const view = document.getElementById('collection-pets-view');
        view.innerHTML = '';

        PETS_DB.forEach(pet => {
            const isOwned    = PlayerProfile.unlockedPets.includes(pet.id);
            const isEquipped = PlayerProfile.activePet === pet.id;

            if (isOwned) {
                view.innerHTML += `
                    <div class="glass-panel p-4 rounded-2xl shadow flex flex-col items-center text-center border-2 ${isEquipped ? 'border-teal-400 relative' : 'border-transparent'} animate-fade-in-up">
                        ${isEquipped ? '<div class="absolute -top-2 -right-2 bg-teal-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">Đang dùng</div>' : ''}
                        <div class="w-16 h-16 rounded-2xl ${pet.bg} ${pet.color} flex items-center justify-center text-3xl mb-2 shadow-inner" style="animation: float-up 3s ease-in-out infinite;">
                            <i class="fa-solid ${pet.icon}"></i>
                        </div>
                        <h3 class="font-bold text-slate-800 text-sm">${pet.name}</h3>
                    </div>
                `;
            } else {
                view.innerHTML += `
                    <div class="glass-panel p-4 rounded-2xl flex flex-col items-center text-center opacity-60 grayscale animate-fade-in-up">
                        <div class="w-16 h-16 rounded-2xl bg-slate-200/50 text-slate-400 flex items-center justify-center text-3xl mb-2 shadow-inner">
                            <i class="fa-solid fa-lock"></i>
                        </div>
                        <h3 class="font-bold text-slate-500 text-sm">Chưa mở</h3>
                    </div>
                `;
            }
        });
    }

    function renderWords() {
        const view = document.getElementById('collection-words-view');
        view.innerHTML = '';

        if (PlayerProfile.learnedWords.length === 0) {
            view.innerHTML = `<div class="text-center text-slate-400 mt-10 w-full animate-fade-in-up">Bạn chưa học từ nào.<br>Hãy chơi Learn Mode nhé!</div>`;
            return;
        }

        PlayerProfile.learnedWords.forEach(w => {
            view.innerHTML += `
                <div class="glass-panel p-3 rounded-xl shadow-sm flex items-center justify-between shrink-0 animate-fade-in-up">
                    <div>
                        <div class="font-bold text-slate-800 text-lg">${w.en}</div>
                        <div class="text-xs text-slate-500 font-mono">${w.ipa || ''}</div>
                    </div>
                    <div class="text-teal-600 font-bold">${w.vn}</div>
                </div>
            `;
        });
    }

    return { renderPets, renderWords };

})();