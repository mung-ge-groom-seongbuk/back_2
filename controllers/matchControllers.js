const { User, Matching, RunningData,UserLocation, Sequelize } = require('../models');
const { Op } = require('sequelize');


//반경 3km이내 사용자 목록
exports.getNearbyUsers = async (req, res) => {
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
                    Sequelize.fn('point', 126.978, 37.5665),
                    Sequelize.fn('point', { longitude: Sequelize.col('UserLocation.longitude'), latitude: Sequelize.col('UserLocation.latitude') })
                ),
                { [Op.lte]: 3000 }
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


