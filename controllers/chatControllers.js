//채팅 관련 기능

const { Chat } = require("../models/index");
const { Op } = require("sequelize");

// 메시지 전송
exports.sendMessage = async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;

    try {
        const newMessage = await Chat.create({
            sender_id,
            receiver_id,
            message,
            created_at: new Date(),
        });

        req.io.emit('chatMessage', newMessage);

        return res.status(200).json({
            success: true,
            data: newMessage,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "메시지 전송에 실패했습니다.",
        });
    }
};

// 메시지 조회
exports.getMessages = async (req, res) => {
    const { sender_id, receiver_id } = req.params;

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
        return res.status(500).json({
            success: false,
            message: "메시지 조회에 실패했습니다.",
        });
    }
};
