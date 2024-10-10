const { User, Matching, RunningData, UserLocation, Sequelize } = require('../models');
const { Op } = require('sequelize');
const { sendFirebaseNotification } = require('../config/firebase');

// 반경 3km 이내 사용자 목록
exports.getNearbyUsers = async (req, res) => {
    const { longitude, latitude } = req.body; // 요청에서 경도와 위도를 가져옵니다.

    try {
        const users = await User.findAll({
            attributes: [
                'user_id',
                'nickname',
                'intro',
                [Sequelize.fn('COUNT', Sequelize.col('RunningData.run_id')), 'run_count'],
                [Sequelize.fn('SUM', Sequelize.col('RunningData.distance_km')), 'total_distance'],
                [Sequelize.fn('AVG', Sequelize.col('RunningData.pace')), 'avg_pace'],
                'UserLocation.id',
                'UserLocation.latitude',
                'UserLocation.longitude'
            ],
            include: [
                {
                    model: RunningData,
                    attributes: [] // RunningData의 컬럼은 COUNT, SUM, AVG로 대체하므로 빈 배열로 설정
                },
                {
                    model: UserLocation,
                    attributes: []
                }
            ],
            where: Sequelize.where(
                Sequelize.fn('ST_Distance_Sphere',
                    Sequelize.fn('point', longitude, latitude),
                    Sequelize.fn('point', Sequelize.col('UserLocation.longitude'), Sequelize.col('UserLocation.latitude'))
                ),
                { [Op.lte]: 3000 } // 3km 이내
            ),
            group: ['User.user_id', 'User.nickname', 'User.intro', 'UserLocation.id', 'UserLocation.latitude', 'UserLocation.longitude']
        });

        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 매칭 요청 보내기
exports.sendMatchRequest = async (req, res) => {
    const user = req.user; // JWT로 인증된 사용자 정보 가져오기

    if (!user) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    try {
        const { responder_id, message } = req.body;

        // 메시지 길이 검증
        if (message && message.length > 500) {
            return res.status(400).json({ error: '메시지는 500자 이하이어야 합니다.' });
        }

        // 매칭 요청 생성
        const newMatch = await Matching.create({
            requester_id: user.user_id,
            responder_id,
            message,
            status: 'requested'
        });

        // 상대방에게 푸시 알림 보내기
        const responder = await User.findByPk(responder_id);
        if (responder && responder.firebase_token) {
            const payload = {
                notification: {
                    title: '새로운 매칭 요청',
                    body: `${user.nickname} 님이 매칭을 요청했습니다.`,
                }
            };
            await sendFirebaseNotification(responder.firebase_token, payload);
        }

        res.status(200).json({ message: '매칭 요청이 전송되었습니다.', match: newMatch });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '매칭 요청 전송에 실패했습니다.' });
    }
};






