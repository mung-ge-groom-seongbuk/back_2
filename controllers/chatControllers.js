const { Chat, User } = require('../models'); // Chat과 User 모델을 가져옵니다.
const { Op } = require("sequelize");

exports.sendMessage = async (req, res) => {
    try {
        const { sender_id, receiver_id, message } = req.body;

        // 새로운 메시지 생성
        const chatMessage = await Chat.create({
            sender_id,
            receiver_id,
            message,
            created_at: new Date()
        });

        res.status(201).json({
            success: true,
            message: '메시지가 전송되었습니다.',
            chatMessage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: '메시지 전송 중 오류가 발생했습니다.'
        });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { sender_id, receiver_id } = req.params;

        // 특정 송신자와 수신자 간의 메시지 조회
        const messages = await Chat.findAll({
            where: {
                sender_id,
                receiver_id
            },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['user_id', 'nickname', 'profile_picture'], // 송신자 정보 포함
                },
                {
                    model: User,
                    as: 'receiver',
                    attributes: ['user_id', 'nickname', 'profile_picture'], // 수신자 정보 포함
                }
            ],
            order: [['created_at', 'ASC']] // 메시지를 시간 순으로 정렬
        });

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: '메시지 조회 중 오류가 발생했습니다.'
        });
    }
};



