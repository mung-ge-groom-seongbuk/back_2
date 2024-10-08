//매칭 관련... 

const { User, Matching, RunningData, Sequelize } = require('../models');
const { Op } = require('sequelize');

// 반경 3km 이내 사용자 목록 가져오기
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
                }
            ],
            where: Sequelize.literal(`ST_Distance_Sphere(
                point(${longitude}, ${latitude}), point(longitude, latitude)
            ) <= 3000`), // 반경 3km
            attributes: ['nickname', 'intro']
        });

        res.status(200).json(nearbyUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch nearby users.' });
    }
};

// 매칭 요청 보내기
exports.sendMatchRequest = async (req, res) => {
    try {
        const { requester_id, responder_id, message } = req.body;

        // 매칭 요청 생성
        const newMatch = await Matching.create({
            requester_id,
            responder_id,
            message,
            status: 'pending'
        });

        res.status(200).json({ message: 'Match request sent.', match: newMatch });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send match request.' });
    }
};

// 받은 매칭 요청 목록 가져오기
exports.getMatchRequests = async (req, res) => {
    try {
        const matchRequests = await Matching.findAll({
            where: { responder_id: req.user.user_id, status: 'pending' },
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
        res.status(500).json({ error: 'Failed to fetch match requests.' });
    }
};

// 매칭 요청 수락
exports.acceptMatch = async (req, res) => {
    try {
        const { match_id } = req.body;

        await Matching.update({ status: 'accepted' }, { where: { match_id } });

        res.status(200).json({ message: 'Match accepted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to accept match request.' });
    }
};
