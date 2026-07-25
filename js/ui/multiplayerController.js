/**
 * js/ui/multiplayerController.js
 * Layer: APPLICATION/UI
 * Responsibility: Handle WebSocket connection, chat, and matchmaking logic (Supabase Realtime).
 */

const MultiplayerController = (() => {

    let channel = null;
    let isChatOpen = false;
    let currentRoomId = null;
    let isMatchmaking = false;

    function init() {
        if (!window.supabaseClient) return;
        
        // Cần đợi 1 chút để AuthState có data nếu user đã login
        setTimeout(() => {
            channel = supabaseClient.channel('lexipets_global', {
                config: { broadcast: { self: true } }
            });

            // Chat
            channel.on('broadcast', { event: 'chat_message' }, (payload) => {
                const msg = payload.payload;
                const container = document.getElementById('chat-messages');
                if (container) {
                    const isMe = AuthState.currentUser === msg.username;
                    const nameColor = isMe ? 'text-indigo-600' : 'text-slate-600';
                    const name = msg.username || 'Guest';
                    container.innerHTML += `<div class="mb-1"><span class="font-bold ${nameColor}">${name}:</span> <span class="text-slate-800">${msg.text}</span></div>`;
                    container.scrollTop = container.scrollHeight;
                }
            });

            // Matchmaking (P2P Broadcast)
            channel.on('broadcast', { event: 'find_match' }, (payload) => {
                // If I am also looking for a match and I hear someone else looking
                if (isMatchmaking && payload.payload.username !== AuthState.currentUser) {
                    isMatchmaking = false; // Stop looking
                    const roomId = 'room_' + Date.now();
                    
                    // Tell the other person we found a match
                    channel.send({ 
                        type: 'broadcast', 
                        event: 'match_found', 
                        payload: { players: [AuthState.currentUser, payload.payload.username], roomId }
                    });
                    
                    // Start my game
                    currentRoomId = roomId;
                    UIHelpers.showToast("Đã tìm thấy đối thủ!");
                    UI.showScreen('menu');
                    GameController.startGame('challenge', payload.payload.username, roomId);
                }
            });

            channel.on('broadcast', { event: 'match_found' }, (payload) => {
                if (isMatchmaking && payload.payload.players.includes(AuthState.currentUser)) {
                    isMatchmaking = false;
                    currentRoomId = payload.payload.roomId;
                    const opponent = payload.payload.players.find(p => p !== AuthState.currentUser);
                    UIHelpers.showToast("Đã tìm thấy đối thủ!");
                    UI.showScreen('menu');
                    GameController.startGame('challenge', opponent, currentRoomId);
                }
            });

            // Game Score Updates
            channel.on('broadcast', { event: 'score_update' }, (payload) => {
                if (currentRoomId && payload.payload.roomId === currentRoomId && payload.payload.username !== AuthState.currentUser) {
                    const oppScoreEl = document.getElementById('opponent-score-display');
                    if (oppScoreEl) {
                        oppScoreEl.innerText = `${payload.payload.username}: ${payload.payload.score} điểm`;
                        oppScoreEl.parentElement.classList.remove('hidden');
                        oppScoreEl.parentElement.classList.add('flex');
                    }
                }
            });

            channel.on('broadcast', { event: 'match_end' }, (payload) => {
                if (currentRoomId && payload.payload.roomId === currentRoomId && payload.payload.username !== AuthState.currentUser) {
                    UIHelpers.showToast(`Đối thủ đã kết thúc với ${payload.payload.finalScore} điểm.`);
                }
            });

            // Direct Challenge
            channel.on('broadcast', { event: 'challenge_request' }, (payload) => {
                if (payload.payload.to === AuthState.currentUser) {
                    if (confirm(`${payload.payload.from} muốn thách đấu với bạn! Chấp nhận?`)) {
                        channel.send({
                            type: 'broadcast',
                            event: 'challenge_response',
                            payload: { from: AuthState.currentUser, to: payload.payload.from, accepted: true, roomId: 'room_'+Date.now() }
                        });
                    } else {
                        channel.send({
                            type: 'broadcast',
                            event: 'challenge_response',
                            payload: { from: AuthState.currentUser, to: payload.payload.from, accepted: false }
                        });
                    }
                }
            });

            channel.on('broadcast', { event: 'challenge_response' }, (payload) => {
                if (payload.payload.to === AuthState.currentUser) {
                    if (payload.payload.accepted) {
                        currentRoomId = payload.payload.roomId;
                        UIHelpers.showToast(`${payload.payload.from} đã đồng ý!`);
                        UI.showScreen('menu');
                        GameController.startGame('challenge', payload.payload.from, currentRoomId);
                    } else {
                        UIHelpers.showToast(`${payload.payload.from} đã từ chối lời mời thách đấu.`);
                    }
                }
            });

            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Connected to Supabase Realtime Broadcast');
                }
            });

        }, 1500);
    }

    // --- Chat ---
    function toggleChat() {
        isChatOpen = !isChatOpen;
        const chatWin = document.getElementById('chat-window');
        const toggleBtn = document.getElementById('chat-toggle-btn');
        if (isChatOpen) {
            chatWin.classList.remove('hidden');
            chatWin.classList.add('flex');
            toggleBtn.classList.add('hidden');
        } else {
            chatWin.classList.add('hidden');
            chatWin.classList.remove('flex');
            toggleBtn.classList.remove('hidden');
        }
    }

    function sendChat() {
        if (!channel) return;
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        
        const username = AuthState.currentUser || 'Guest';
        channel.send({ type: 'broadcast', event: 'chat_message', payload: { username, text } });
        input.value = '';
    }

    // --- Matchmaking ---
    function openMatchmaking() {
        if (!AuthState.currentUser) {
            UIHelpers.showToast("Bạn cần đăng nhập để chơi PvP!");
            return;
        }
        if (!channel) {
            UIHelpers.showToast("Không thể kết nối Server PvP.");
            return;
        }

        UI.showScreen('matchmaking');
        isMatchmaking = true;
        channel.send({ type: 'broadcast', event: 'find_match', payload: { username: AuthState.currentUser } });
    }

    function cancelMatchmaking() {
        UI.showScreen('menu');
        isMatchmaking = false;
    }
    
    function sendScoreUpdate(score) {
        if (channel && currentRoomId && AuthState.currentUser) {
            channel.send({ type: 'broadcast', event: 'score_update', payload: { roomId: currentRoomId, username: AuthState.currentUser, score } });
        }
    }

    function sendMatchEnd(score) {
        if (channel && currentRoomId && AuthState.currentUser) {
            channel.send({ type: 'broadcast', event: 'match_end', payload: { roomId: currentRoomId, username: AuthState.currentUser, finalScore: score } });
            currentRoomId = null;
        }
    }

    function challengeFriend(targetUsername) {
        if (!channel) return;
        channel.send({ type: 'broadcast', event: 'challenge_request', payload: { from: AuthState.currentUser, to: targetUsername } });
        UIHelpers.showToast(`Đã gửi thách đấu tới ${targetUsername}`);
    }

    function loginUser(username) {
        // Broadcast presence in future. For now not needed strictly.
    }

    setTimeout(init, 1000);

    return { 
        init, toggleChat, sendChat, 
        openMatchmaking, cancelMatchmaking,
        sendScoreUpdate, sendMatchEnd, challengeFriend, loginUser
    };

})();
