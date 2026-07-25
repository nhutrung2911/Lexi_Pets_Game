/**
 * js/ui/socialController.js
 * Layer: APPLICATION/UI
 * Responsibility: Handle Leaderboard and Friends API calls & rendering (Supabase).
 */

const SocialController = (() => {

    async function openLeaderboard() {
        UI.showScreen('leaderboard');
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = '<div class="text-center text-slate-500 mt-10">Đang tải...</div>';

        if (!window.supabaseClient) {
            list.innerHTML = '<div class="text-center text-rose-500 mt-10">Lỗi kết nối CSDL.</div>';
            return;
        }

        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('username, pet_exp')
                .order('pet_exp', { ascending: false })
                .limit(20);

            if (!error && data) {
                _renderLeaderboard(data.map(u => ({ username: u.username, petExp: u.pet_exp || 0 })));
            } else {
                list.innerHTML = '<div class="text-center text-rose-500 mt-10">Lỗi tải dữ liệu.</div>';
            }
        } catch (e) {
            list.innerHTML = '<div class="text-center text-rose-500 mt-10">Không thể kết nối máy chủ.</div>';
        }
    }

    function _renderLeaderboard(boardData) {
        const list = document.getElementById('leaderboard-list');
        list.innerHTML = '';

        if (boardData.length === 0) {
            list.innerHTML = '<div class="text-center text-slate-500 mt-10">Chưa có dữ liệu.</div>';
            return;
        }

        boardData.forEach((user, idx) => {
            let rankClass = "bg-slate-100 text-slate-600";
            if (idx === 0) rankClass = "bg-yellow-100 text-yellow-600 border-2 border-yellow-300";
            else if (idx === 1) rankClass = "bg-slate-200 text-slate-500";
            else if (idx === 2) rankClass = "bg-orange-100 text-orange-600";

            list.innerHTML += `
                <div class="glass-panel p-4 rounded-2xl shadow-sm flex items-center gap-4 animate-fade-in-up">
                    <div class="w-10 h-10 ${rankClass} rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                        ${idx + 1}
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-slate-800 text-lg leading-none">${user.username}</h4>
                        <div class="text-xs font-bold text-teal-600 mt-1">Pet EXP: ${user.petExp}</div>
                    </div>
                </div>
            `;
        });
    }

    async function loadMiniLeaderboard() {
        const list = document.getElementById('mini-leaderboard-list');
        if (!list || !window.supabaseClient) return;

        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('username, pet_exp')
                .order('pet_exp', { ascending: false })
                .limit(4);

            if (!error && data) {
                list.innerHTML = '';
                data.forEach((user, idx) => {
                    let iconHtml = `<div class="w-5 h-5 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-[10px]">${idx + 1}</div>`;
                    if (idx === 0) iconHtml = `<i class="fa-solid fa-medal text-yellow-500 text-sm"></i>`;
                    else if (idx === 1) iconHtml = `<i class="fa-solid fa-medal text-slate-400 text-sm"></i>`;
                    else if (idx === 2) iconHtml = `<i class="fa-solid fa-medal text-orange-400 text-sm"></i>`;

                    list.innerHTML += `
                        <div class="flex items-center justify-between p-1.5 rounded-xl hover:bg-white/40 transition">
                            <div class="flex items-center gap-2">
                                <div class="w-5 flex justify-center">${iconHtml}</div>
                                <div class="w-6 h-6 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-[10px]"><i class="fa-solid fa-user"></i></div>
                                <span class="text-sm font-bold text-slate-700 w-16 truncate">${user.username}</span>
                            </div>
                            <div class="text-xs font-bold text-slate-600 flex items-center gap-1">
                                ${user.pet_exp || 0} <i class="fa-solid fa-trophy text-yellow-500 text-[10px]"></i>
                            </div>
                        </div>
                    `;
                });
            }
        } catch (e) {}
    }

    // --- Friends ---
    async function openFriends() {
        UI.showScreen('friends');
        if (!AuthState.currentUser || !window.supabaseClient) {
            document.getElementById('friends-list').innerHTML = '<div class="text-center text-slate-500 mt-10">Vui lòng đăng nhập!</div>';
            return;
        }
        await fetchFriends();
    }

    async function fetchFriends() {
        const list = document.getElementById('friends-list');
        list.innerHTML = '<div class="text-center text-slate-500 mt-10">Đang tải...</div>';

        const { data: { user } } = await supabaseClient.auth.getUser();
        if(!user) return;

        try {
            // Fetch where user is 1 or 2
            const { data, error } = await supabaseClient
                .from('friends')
                .select(`
                    id, status, user_id_1, user_id_2,
                    profile1:user_id_1(username),
                    profile2:user_id_2(username)
                `)
                .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`);
            
            if (error) throw error;

            const friendsData = data.map(f => {
                const isInitiator = f.user_id_1 === user.id;
                const friendName = isInitiator ? f.profile2?.username : f.profile1?.username;
                let direction = isInitiator ? 'sent' : 'received';
                return {
                    requestId: f.id,
                    friendName: friendName || 'Unknown',
                    status: f.status,
                    direction
                };
            });
            _renderFriends(friendsData);
            
        } catch (e) {
            list.innerHTML = '<div class="text-center text-rose-500 mt-10">Không thể kết nối máy chủ.</div>';
        }
    }

    function _renderFriends(friendsData) {
        const list = document.getElementById('friends-list');
        list.innerHTML = '';

        if (friendsData.length === 0) {
            list.innerHTML = '<div class="text-center text-slate-500 mt-10">Chưa có bạn bè.</div>';
            return;
        }

        friendsData.forEach(f => {
            let actionHtml = '';
            
            if (f.status === 'accepted') {
                actionHtml = `<button onclick="MultiplayerController.challengeFriend('${f.friendName}')" class="px-3 py-1 bg-rose-500 text-white font-bold rounded-lg text-xs shadow-[0_2px_0_#be123c] active:scale-95 transition">Thách Đấu</button>`;
            } else if (f.status === 'pending' && f.direction === 'received') {
                actionHtml = `
                    <div class="flex gap-2">
                        <button onclick="SocialController.acceptFriend(${f.requestId})" class="px-2 py-1 bg-teal-500 text-white font-bold rounded-lg text-xs">Đồng Ý</button>
                        <button onclick="SocialController.rejectFriend(${f.requestId})" class="px-2 py-1 bg-slate-300 text-slate-600 font-bold rounded-lg text-xs">Xóa</button>
                    </div>
                `;
            } else if (f.status === 'pending' && f.direction === 'sent') {
                actionHtml = `<span class="text-xs text-slate-400 font-bold">Đã gửi</span>`;
            }

            list.innerHTML += `
                <div class="glass-panel p-3 rounded-xl shadow-sm flex items-center gap-3 border border-slate-100 mb-2">
                    <div class="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-slate-800 leading-none">${f.friendName}</h4>
                        <div class="text-xs ${f.status === 'accepted' ? 'text-teal-600' : 'text-slate-500'} mt-1">${f.status === 'accepted' ? 'Bạn bè' : 'Chờ xác nhận'}</div>
                    </div>
                    <div>${actionHtml}</div>
                </div>
            `;
        });
    }

    async function addFriend() {
        if (!AuthState.currentUser || !window.supabaseClient) {
            UIHelpers.showToast("Bạn cần đăng nhập để kết bạn!");
            return;
        }

        const input = document.getElementById('friend-search-input');
        const targetUsername = input.value.trim();
        if (!targetUsername) return;

        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            
            // Find target user id
            const { data: targetProfile, error: targetError } = await supabaseClient
                .from('profiles')
                .select('id')
                .eq('username', targetUsername)
                .single();
                
            if (targetError || !targetProfile) {
                UIHelpers.showToast("Không tìm thấy người chơi này.");
                return;
            }
            
            if (targetProfile.id === user.id) {
                UIHelpers.showToast("Không thể kết bạn với chính mình!");
                return;
            }

            // Insert friend request
            const { error: insertError } = await supabaseClient
                .from('friends')
                .insert({
                    user_id_1: user.id,
                    user_id_2: targetProfile.id,
                    status: 'pending'
                });
                
            if (insertError) {
                UIHelpers.showToast("Đã gửi yêu cầu hoặc đã là bạn bè.");
            } else {
                UIHelpers.showToast("Đã gửi yêu cầu kết bạn!");
                input.value = '';
                fetchFriends();
            }
        } catch (e) {
            UIHelpers.showToast("Lỗi kết nối máy chủ");
        }
    }

    async function acceptFriend(requestId) {
        if(!window.supabaseClient) return;
        try {
            const { error } = await supabaseClient
                .from('friends')
                .update({ status: 'accepted' })
                .eq('id', requestId);
                
            if (!error) {
                UIHelpers.showToast("Đã thêm bạn!");
                fetchFriends();
            }
        } catch (e) {}
    }

    async function rejectFriend(requestId) {
        if(!window.supabaseClient) return;
        try {
            const { error } = await supabaseClient
                .from('friends')
                .delete()
                .eq('id', requestId);
                
            if (!error) {
                fetchFriends();
            }
        } catch (e) {}
    }

    return { openLeaderboard, openFriends, addFriend, acceptFriend, rejectFriend, loadMiniLeaderboard };

})();
