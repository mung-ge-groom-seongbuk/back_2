const { Chat, Matching } = require('../models');

// 채팅 메시지 전송
exports.sendMessage = async (req, res) => {
    const user = req.user; // 세션에서 사용자 정보를 가져옴

    if (!user) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    try {
        const { match_id, message } = req.body;

        // 메시지 길이 검증
        if (message && message.length > 500) {
            return res.status(400).json({ error: '메시지는 500자 이하이어야 합니다.' });
        }

        // 매칭 상태 확인 (매칭이 'accepted'인 경우만 채팅 가능)
        const match = await Matching.findOne({
            where: {
                match_id: match_id,
                status: 'accepted' // 매칭 상태가 'accepted'인 경우에만 채팅 허용
            }
        });

        if (!match) {
            return res.status(403).json({ error: '매칭이 완료되지 않아 채팅을 시작할 수 없습니다.' });
        }

        // 채팅 메시지 저장
        const newMessage = await Chat.create({
            match_id,
            sender_id: user.user_id, // 세션에서 사용자 ID를 가져옴
            receiver_id: match.requester_id === user.user_id ? match.responder_id : match.requester_id, // 상대방 ID 설정
            message
        });

        res.status(200).json({ message: '메시지가 전송되었습니다.', chat: newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '메시지 전송에 실패했습니다.' });
    }
};

// 채팅 메시지 목록 가져오기
exports.getMessages = async (req, res) => {
    const user = req.session.user; // 세션에서 사용자 정보를 가져옴

    if (!user) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    try {
        const { match_id } = req.params;

        // 매칭 상태 확인 (매칭이 'accepted'인 경우만 메시지 조회 가능)
        const match = await Matching.findOne({
            where: {
                match_id: match_id,
                status: 'accepted' // 매칭 상태가 'accepted'인 경우만 메시지 조회 허용
            }
        });

        if (!match) {
            return res.status(403).json({ error: '매칭이 완료되지 않아 메시지를 조회할 수 없습니다.' });
        }

        // 채팅 메시지 목록 조회
        const messages = await Chat.findAll({
            where: { match_id },
            order: [['created_at', 'ASC']] // 메시지를 생성된 순서대로 정렬
        });

        res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '메시지 목록을 가져오는 데 실패했습니다.' });
    }
};

// 채팅 삭제
exports.deleteMessage = async (req, res) => {
    const user = req.session.user; // 세션에서 사용자 정보를 가져옴

    if (!user) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    try {
        const { chat_id } = req.params;

        // 채팅 메시지 삭제 (본인이 보낸 메시지만 삭제 가능)
        const message = await Chat.findOne({ where: { chat_id, sender_id: user.user_id } });

        if (!message) {
            return res.status(403).json({ error: '해당 메시지를 삭제할 권한이 없습니다.' });
        }

        await Chat.destroy({ where: { chat_id } });

        res.status(200).json({ message: '메시지가 삭제되었습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '메시지 삭제에 실패했습니다.' });
    }
};




