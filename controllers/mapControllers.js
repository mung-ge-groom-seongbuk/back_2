const { UserLocation, User, RunningData, Matching, Sequelize } = require('../models');
const { Op } = require("sequelize"); // Op 객체 불러오기

// 매칭된 사용자 위치 가져오기
exports.getMatchedUsersLocation = async (req, res) => {
    try {
        // 현재 사용자와 매칭된 사용자 정보 가져오기
        const matchedUsers = await Matching.findAll({
            where: {
                [Op.or]: [
                    { requester_id: req.user.user_id, status: 'accepted' },
                    { responder_id: req.user.user_id, status: 'accepted' }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'requester',
                    attributes: ['nickname', 'intro', 'profile_picture'],
                    include: [
                        {
                            model: UserLocation,
                            attributes: ['latitude', 'longitude']
                        },
                        {
                            model: RunningData,
                            attributes: [
                                [Sequelize.fn('COUNT', Sequelize.col('run_id')), 'run_count'],
                                [Sequelize.fn('SUM', Sequelize.col('distance_km')), 'total_distance'],
                                [Sequelize.fn('AVG', Sequelize.col('pace')), 'avg_pace']
                            ],
                            group: ['requester.user_id'] // 그룹화 추가
                        }
                    ]
                },
                {
                    model: User,
                    as: 'responder',
                    attributes: ['nickname', 'intro', 'profile_picture'],
                    include: [
                        {
                            model: UserLocation,
                            attributes: ['latitude', 'longitude']
                        },
                        {
                            model: RunningData,
                            attributes: [
                                [Sequelize.fn('COUNT', Sequelize.col('run_id')), 'run_count'],
                                [Sequelize.fn('SUM', Sequelize.col('distance_km')), 'total_distance'],
                                [Sequelize.fn('AVG', Sequelize.col('pace')), 'avg_pace']
                            ],
                            group: ['responder.user_id'] // 그룹화 추가
                        }
                    ]
                }
            ]
        });

        // 매칭된 사용자의 위치와 정보를 응답
        res.status(200).json({ matchedUsers }); // 응답 구조화
    } catch (err) {
        console.error('Error fetching matched users location:', err); // 구체적인 에러 로그
        res.status(500).json({ error: 'Failed to fetch matched users location.', details: err.message }); // 에러 메시지 추가
    }
};

