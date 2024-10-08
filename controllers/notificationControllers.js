// 알림 설정

const { Matching, User } = require('../models');

// 매칭 알림 확인 (매칭 요청 받은 경우)
exports.getMatchNotifications = async (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' }); // 로그인이 필요함
    }

    try {
        const matchRequests = await Matching.findAll({
            where: { responder_id: req.session.user_id, status: 'pending' },
            include: [
                {
                    model: User,
                    as: 'requester',
                    attributes: ['nickname', 'intro']
                }
            ],
            attributes: ['message'],
        });

        if (matchRequests.length === 0) {
            return res.status(200).json({ message: 'No match requests.' });
        }

        res.status(200).json(matchRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch match notifications.' });
    }
};


// 매칭 요청 수락 또는 거절
exports.respondToMatch = async (req, res) => {
    try {
        const { match_id, action } = req.body;
        if (action === 'accept') {
            await Matching.update({ status: 'accepted' }, { where: { match_id } });
            res.status(200).json({ message: 'Match accepted.' });
        } else if (action === 'reject') {
            await Matching.update({ status: 'rejected' }, { where: { match_id } });
            res.status(200).json({ message: 'Match rejected.' });
        } else {
            res.status(400).json({ error: 'Invalid action.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to respond to match request.' });
    }
};

