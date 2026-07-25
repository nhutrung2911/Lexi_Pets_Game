/**
 * js/ui/questController.js
 * Responsibility: Generate daily quests, track progress, render UI.
 */

const QuestController = (() => {

    const QUEST_TYPES = [
        { id: 'find_words', desc: 'Tìm {target} từ vựng', targetRange: [10, 30], rewardRange: [50, 100] },
        { id: 'play_pvp', desc: 'Chơi {target} ván PvP', targetRange: [1, 3], rewardRange: [100, 200] },
        { id: 'buy_item', desc: 'Mua {target} vật phẩm', targetRange: [1, 2], rewardRange: [50, 80] }
    ];

    function init() {
        // Check if quests need generation
        if (!PlayerProfile.quests || PlayerProfile.quests.length === 0) {
            _generateQuests();
        }
        renderQuests();
    }

    function _generateQuests() {
        PlayerProfile.quests = [];
        const types = [...QUEST_TYPES].sort(() => 0.5 - Math.random()).slice(0, 3);
        
        types.forEach(t => {
            const target = Math.floor(Math.random() * (t.targetRange[1] - t.targetRange[0] + 1)) + t.targetRange[0];
            const reward = Math.floor(Math.random() * (t.rewardRange[1] - t.rewardRange[0] + 1)) + t.rewardRange[0];
            
            PlayerProfile.quests.push({
                id: t.id,
                desc: t.desc.replace('{target}', target),
                target: target,
                progress: 0,
                reward: reward,
                isClaimed: false
            });
        });
        AuthController.saveGame();
    }

    function updateProgress(questId, amount = 1) {
        if (!PlayerProfile.quests) return;
        let updated = false;
        
        PlayerProfile.quests.forEach(q => {
            if (q.id === questId && !q.isClaimed && q.progress < q.target) {
                q.progress += amount;
                if (q.progress > q.target) q.progress = q.target;
                updated = true;
                if (q.progress === q.target) {
                    UIHelpers.showToast(`Nhiệm vụ hoàn thành: ${q.desc} (Vào Menu để nhận)`);
                }
            }
        });

        if (updated) {
            AuthController.saveGame();
            renderQuests();
        }
    }

    function claimReward(index) {
        const quest = PlayerProfile.quests[index];
        if (!quest || quest.isClaimed || quest.progress < quest.target) return;

        quest.isClaimed = true;
        PlayerProfile.totalCoins += quest.reward;
        
        AudioManager.playCoin();
        UIHelpers.showToast(`Nhận +${quest.reward} Vàng!`);
        
        AuthController.saveGame();
        renderQuests();
        UI.updateMenuUI();
    }

    function renderQuests() {
        const container = document.getElementById('quests-list');
        if (!container) return;

        if (!PlayerProfile.quests || PlayerProfile.quests.length === 0) {
            container.innerHTML = '<div class="text-sm text-slate-500">Chưa có nhiệm vụ nào.</div>';
            return;
        }

        container.innerHTML = '';
        PlayerProfile.quests.forEach((q, idx) => {
            const isCompleted = q.progress >= q.target;
            const progressPercent = Math.min((q.progress / q.target) * 100, 100);
            
            let btnHtml = '';
            if (q.isClaimed) {
                btnHtml = `<button disabled class="px-3 py-1 bg-slate-200 text-slate-400 font-bold rounded-lg text-xs">Đã nhận</button>`;
            } else if (isCompleted) {
                btnHtml = `<button onclick="QuestController.claimReward(${idx})" class="px-3 py-1 bg-yellow-400 text-white font-bold rounded-lg text-xs shadow-[0_2px_0_#ca8a04] active:scale-95 transition">Nhận</button>`;
            } else {
                btnHtml = `<div class="text-xs font-bold text-slate-400">${q.progress}/${q.target}</div>`;
            }

            container.innerHTML += `
                <div class="glass-panel rounded-xl p-3 flex items-center justify-between gap-2 border border-white/50 animate-fade-in-up">
                    <div class="flex-1">
                        <div class="text-sm font-bold text-slate-800">${q.desc}</div>
                        <div class="text-xs text-yellow-600 font-bold mt-1">+${q.reward} Vàng</div>
                        ${!q.isClaimed && !isCompleted ? `
                            <div class="w-full bg-slate-200/50 rounded-full h-1.5 mt-2">
                                <div class="bg-indigo-400 h-1.5 rounded-full" style="width: ${progressPercent}%"></div>
                            </div>
                        ` : ''}
                    </div>
                    <div>${btnHtml}</div>
                </div>
            `;
        });
    }

    return { init, updateProgress, claimReward, renderQuests };

})();
