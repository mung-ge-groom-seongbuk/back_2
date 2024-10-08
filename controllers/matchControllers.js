const { User, Matching, RunningData,UserLocation, Sequelize } = require('../models');
const { Op } = require('sequelize');

//반경 3km이내 사용자 목록
exports.getNearbyUsers = async (req, res) => {
    try {
        const { latitude, longitude } = req.query; // 현재 사용자의 좌표를 쿼리에서 받음

        const nearbyUsers = await User.findAll({
            include: [
                {
                    model: RunningData,
                    attributes: [
                        [Sequelize.fn('COUNT', Sequelize.col('run_id')), 'run_count'],
                        [Sequelize.fn('SUM', Sequelize.col('distance_km')), 'total_distance'],
                        [Sequelize.fn('AVG', Sequelize.col('pace')), 'avg_pace']
                    ]
                },
                {
                    model: UserLocation, // Add UserLocation model to include user location
                    attributes: ['latitude', 'longitude'] // Make sure to include latitude and longitude
                }
            ],
            where: Sequelize.literal(`ST_Distance_Sphere(
                point(${longitude}, ${latitude}), point(UserLocation.longitude, UserLocation.latitude)
            ) <= 3000`), // 반경 3km
            attributes: ['user_id', 'nickname', 'intro']
        });

        // 사용자 목록이 비어 있는지 확인
        if (nearbyUsers.length === 0) {
            return res.status(404).json({ message: '근처에 사용자가 없습니다.' });
        }

        res.status(200).json(nearbyUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '근처 사용자 목록을 가져오는 데 실패했습니다.' });
    }
};



// 매칭 요청 보내기
exports.sendMatchRequest = async (req, res) => {
    try {
        const { responder_id, message } = req.body;

        // 메시지 길이 검증
        if (message && message.length > 500) {
            return res.status(400).json({ error: '메시지는 500자 이하이어야 합니다.' });
        }

        // 매칭 요청 생성
        const newMatch = await Matching.create({
            requester_id: req.user.user_id, // 요청자의 ID를 req.user에서 가져옴
            responder_id,
            message,
            status: 'requested' // 상태 값을 'requested'로 설정
        });

        res.status(200).json({ message: '매칭 요청이 전송되었습니다.', match: newMatch });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '매칭 요청 전송에 실패했습니다.' });
    }
};

// 받은 매칭 요청 목록 가져오기
exports.getMatchRequests = async (req, res) => {
    try {
        const matchRequests = await Matching.findAll({
            where: { responder_id: req.user.user_id, status: 'requested' }, // 상태를 'requested'로 필터링
            include: [
                {
                    model: User,
                    as: 'requester',
                    attributes: ['nickname', 'intro']
                }
            ]
        });

        res.status(200).json(matchRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '매칭 요청 목록을 가져오는 데 실패했습니다.' });
    }
};

// 매칭 요청 수락
exports.acceptMatch = async (req, res) => {
    try {
        const { match_id } = req.body;

        await Matching.update({ status: 'accepted' }, { where: { match_id } });

        res.status(200).json({ message: '매칭 요청이 수락되었습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '매칭 요청 수락에 실패했습니다.' });
    }
};


