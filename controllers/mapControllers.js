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
                    attributes: ['user_id', 'nickname', 'intro', 'profile_picture'],
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
                            group: ['requester.user_id']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'responder',
                    attributes: ['user_id', 'nickname', 'intro', 'profile_picture'],
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
                            group: ['responder.user_id']
                        }
                    ]
                }
            ]
        });

        // matchedUsers 내용 확인
        console.log('Matched Users:', matchedUsers);

        if (!matchedUsers || matchedUsers.length === 0) {
            console.log('No matched users found for user_id:', req.user.user_id);
            return res.status(404).json({ message: 'No matched users found.' });
        }

        // 매칭된 사용자의 위치와 정보를 응답
        res.status(200).json({ matchedUsers });
    } catch (err) {
        console.error('Error fetching matched users location:', err);
        res.status(500).json({ error: 'Failed to fetch matched users location.', details: err.message });
    }
};


