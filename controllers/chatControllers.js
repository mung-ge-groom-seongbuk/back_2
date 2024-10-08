const { Chat } = require("../models/index");
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

// 메시지 조회
exports.getMessages = async (req, res) => {
    const { sender_id, receiver_id } = req.params;

    // 입력 데이터 유효성 검사
    if (!sender_id || !receiver_id) {
        return res.status(400).json({
            success: false,
            message: "sender_id and receiver_id are required.",
        });
    }

    try {
        const messages = await Chat.findAll({
            where: {
                [Op.or]: [
                    { sender_id: sender_id, receiver_id: receiver_id },
                    { sender_id: receiver_id, receiver_id: sender_id },
                ],
            },
            order: [['created_at', 'ASC']],
        });

        return res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        console.error("Error retrieving messages:", error); // 에러 로그 출력
        return res.status(500).json({
            success: false,
            message: "메시지 조회에 실패했습니다.",
        });
    }
};

