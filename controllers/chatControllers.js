const { Chat, User } = require("../models/index");
const { Op } = require("sequelize");

// 메시지 전송
exports.sendMessage = async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;

    // 입력 데이터 유효성 검사
    if (!sender_id || !receiver_id || !message) {
        return res.status(400).json({
            success: false,
            message: "sender_id, receiver_id, and message are required.",
        });
    }

    try {
        // sender와 receiver가 모두 존재하는지 확인
        const sender = await User.findOne({ where: { user_id: sender_id } });
        const receiver = await User.findOne({ where: { user_id: receiver_id } });

        if (!sender || !receiver) {
            return res.status(404).json({
                success: false,
                message: "Sender or receiver does not exist.",
            });
        }

        const newMessage = await Chat.create({
            sender_id,
            receiver_id,
            message,
            created_at: new Date(),
        });

        // 클라이언트로 메시지 전송
        req.io.emit('chatMessage', newMessage);

        return res.status(200).json({
            success: true,
            data: newMessage,
        });
    } catch (error) {
        console.error("Error sending message:", error); // 에러 로그 출력
        return res.status(500).json({
            success: false,
            message: "메시지 전송에 실패했습니다.",
        });
    }
};


