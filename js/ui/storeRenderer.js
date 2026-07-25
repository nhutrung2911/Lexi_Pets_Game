/**
 * js/ui/storeRenderer.js
 * Layer: PRESENTATION
 * Responsibility: Render the pet store list.
 */

const COSMETICS_DB = [
    { id: 'hat_straw', name: 'Mũ Rơm', icon: '👒', price: 100, desc: 'Mát mẻ ngày hè' },
    { id: 'glasses_sun', name: 'Kính Râm', icon: '🕶️', price: 150, desc: 'Cực ngầu' },
    { id: 'bow_tie', name: 'Nơ Xinh', icon: '🎀', price: 120, desc: 'Dễ thương' }
];

const StoreRenderer = (() => {

    function render() {
        const list = document.getElementById('store-list');
        list.innerHTML = '';

        PETS_DB.forEach(pet => {
            const isOwned    = PlayerProfile.unlockedPets.includes(pet.id);
            const isEquipped = PlayerProfile.activePet === pet.id;

            let btnHtml;
            if (isEquipped) {
                btnHtml = `<button disabled class="w-full py-2 mt-3 bg-slate-200 text-slate-500 font-bold rounded-xl">Đang dùng</button>`;
            } else if (isOwned) {
                btnHtml = `<button onclick="StoreController.equipPet('${pet.id}')" class="w-full py-2 mt-3 bg-teal-500 text-white font-bold rounded-xl active:scale-95 transition shadow-[0_4px_0_#0f766e]">Trang bị</button>`;
            } else {
                const canAfford = PlayerProfile.totalCoins >= pet.price;
                btnHtml = `<button onclick="StoreController.buyPet('${pet.id}')" class="w-full py-2 mt-3 ${canAfford ? 'btn-primary' : 'bg-slate-300'} text-white font-bold rounded-xl active:scale-95 transition">
                    ${pet.price} <i class="fa-solid fa-coins"></i> Mua
                </button>`;
            }

            list.innerHTML += `
                <div class="glass-panel p-4 rounded-2xl shadow flex items-center gap-4 animate-fade-in-up">
                    <div class="w-16 h-16 rounded-2xl ${pet.bg} ${pet.color} flex items-center justify-center text-3xl shadow-inner shrink-0">
                        <i class="fa-solid ${pet.icon}"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-slate-800 text-lg">${pet.name}</h3>
                        <p class="text-xs text-slate-500 leading-tight mt-1">${pet.desc}</p>
                        ${btnHtml}
                    </div>
                </div>
            `;
        });
    }

    function renderItems() {
        const countSpan = document.getElementById('inv-pet-food-count');
        if (countSpan) {
            const item = PlayerProfile.inventory.find(i => i.itemId === 'pet_food');
            countSpan.innerText = item ? item.quantity : 0;
        }

        const listCosmetics = document.getElementById('store-cosmetics-list');
        if (listCosmetics) {
            listCosmetics.innerHTML = '';
            COSMETICS_DB.forEach(c => {
                const isOwned = PlayerProfile.inventory.find(i => i.itemId === c.id);
                const isEquipped = PlayerProfile.activeCosmetics.includes(c.id);

                let btnHtml;
                if (isEquipped) {
                    btnHtml = `<button onclick="StoreController.equipCosmetic('${c.id}')" class="flex-1 py-2 btn-glass text-slate-600 font-bold rounded-xl active:scale-95 transition">Tháo ra</button>`;
                } else if (isOwned) {
                    btnHtml = `<button onclick="StoreController.equipCosmetic('${c.id}')" class="flex-1 py-2 bg-teal-500 text-white font-bold rounded-xl active:scale-95 transition shadow-[0_4px_0_#0f766e]">Mặc thử</button>`;
                } else {
                    const canAfford = PlayerProfile.totalCoins >= c.price;
                    btnHtml = `<button onclick="StoreController.buyCosmetic('${c.id}', ${c.price})" class="flex-1 py-2 ${canAfford ? 'btn-primary' : 'bg-slate-300 shadow-[0_4px_0_#cbd5e1]'} text-white font-bold rounded-xl active:scale-95 transition">
                        ${c.price} <i class="fa-solid fa-coins"></i> Mua
                    </button>`;
                }

                listCosmetics.innerHTML += `
                    <div class="glass-panel p-4 rounded-2xl shadow flex items-center gap-4 animate-fade-in-up">
                        <div class="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-4xl shadow-inner shrink-0">
                            ${c.icon}
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-slate-800 text-lg">${c.name}</h3>
                            <p class="text-xs text-slate-500 leading-tight mt-1">${c.desc}</p>
                            <div class="flex gap-2 mt-3">${btnHtml}</div>
                        </div>
                    </div>
                `;
            });
        }
    }

    return { render, renderItems };

})();

// ── Store Use Cases (kept thin, delegates to state + renderer) ──
const StoreController = (() => {

    function buyPet(petId) {
        const pet = PETS_DB.find(p => p.id === petId);
        if (!pet) return;

        if (PlayerProfile.totalCoins < pet.price) {
            UIHelpers.showToast("Bạn không đủ vàng!");
            return;
        }
        if (PlayerProfile.unlockedPets.includes(petId)) return;

        PlayerProfile.totalCoins -= pet.price;
        PlayerProfile.unlockedPets.push(petId);

        AudioManager.playCoin();
        if (window.confetti) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#fbbf24', '#f59e0b']
            });
        }

        UIHelpers.showToast(`Bạn đã mua thành công ${pet.name}!`);
        
        AuthController.saveGame();
        StoreRenderer.render();
        UI.updateMenuUI();

        if (window.QuestController) QuestController.onStorePurchase(pet.price);
    }

    function equipPet(petId) {
        if (!PlayerProfile.unlockedPets.includes(petId)) return;
        PlayerProfile.activePet = petId;
        
        AuthController.saveGame();
        StoreRenderer.render();
        UI.updateMenuUI();
        UIHelpers.showToast("Đã trang bị thú cưng mới!");
    }

    function buyItem(itemId, price) {
        if (PlayerProfile.totalCoins < price) {
            UIHelpers.showToast("Bạn không đủ vàng!");
            return;
        }
        PlayerProfile.totalCoins -= price;
        
        let invItem = PlayerProfile.inventory.find(i => i.itemId === itemId);
        if (invItem) {
            invItem.quantity += 1;
        } else {
            PlayerProfile.inventory.push({ itemId, quantity: 1 });
        }

        AudioManager.playCoin();
        AuthController.saveGame();
        StoreRenderer.renderItems();
        UI.updateMenuUI();

        UIHelpers.showToast("Đã mua thành công!");
        
        if (window.QuestController) QuestController.onStorePurchase(price);
    }

    function buyCosmetic(cId, price) {
        if (PlayerProfile.totalCoins < price) {
            UIHelpers.showToast("Bạn không đủ vàng!");
            return;
        }
        
        PlayerProfile.totalCoins -= price;
        
        if (!PlayerProfile.inventory.find(i => i.itemId === cId)) {
            PlayerProfile.inventory.push({ itemId: cId, quantity: 1 });
        }

        AudioManager.playCoin();
        if (window.confetti) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#ec4899', '#f472b6']
            });
        }
        AuthController.saveGame();
        StoreRenderer.renderItems();
        UI.updateMenuUI();
        UIHelpers.showToast("Đã mua vật phẩm thành công!");
        
        if (window.QuestController) QuestController.onStorePurchase(price);
    }

    function equipCosmetic(cId) {
        const isOwned = PlayerProfile.inventory.find(i => i.itemId === cId);
        if (!isOwned) return;

        if (!PlayerProfile.activeCosmetics) PlayerProfile.activeCosmetics = [];

        const index = PlayerProfile.activeCosmetics.indexOf(cId);
        if (index > -1) {
            PlayerProfile.activeCosmetics.splice(index, 1);
        } else {
            PlayerProfile.activeCosmetics.push(cId);
        }

        AuthController.saveGame();
        StoreRenderer.renderItems();
        UI.updateMenuUI();
        UIHelpers.showToast("Đã cập nhật phụ kiện!");
    }

    return { buyPet, equipPet, buyItem, buyCosmetic, equipCosmetic };

})();