const { Matching, User, UserLocation } = require('../models');
const sendFirebaseNotification = require('../config/firebase').sendFirebaseNotification; // Firebase 푸시 알림 함수

// 매칭 알림 확인 (매칭 요청 받은 경우)
exports.getMatchNotifications = async (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    try {
        const matchRequests = await Matching.findAll({
            where: { responder_id: req.session.user_id, status: 'requested' },
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
        const { match_id, action, latitude, longitude } = req.body; // 위치 정보 추가
        const match = await Matching.findByPk(match_id);

        if (!match) {
            return res.status(404).json({ error: '매칭을 찾을 수 없습니다.' });
        }

        const requester = await User.findByPk(match.requester_id);

        if (action === 'accept') {
            // 매칭 수락 시 위치 정보 저장
            await UserLocation.upsert({
                user_id: req.session.user_id, // 수락한 사용자 ID
                latitude: latitude,
                longitude: longitude
            });

            await Matching.update({ status: 'accepted' }, { where: { match_id } });
            res.status(200).json({ message: 'Match accepted.' });

            // 매칭 수락 시 푸시 알림 전송
            if (requester && requester.firebase_token) {
                const title = '매칭 수락됨';
                const body = '상대방이 매칭 요청을 수락했습니다.';
                await sendFirebaseNotification(requester.firebase_token, title, body);
            }
        } else if (action === 'reject') {
            await Matching.update({ status: 'rejected' }, { where: { match_id } });
            res.status(200).json({ message: 'Match rejected.' });

            // 매칭 거절 시 푸시 알림 전송
            if (requester && requester.firebase_token) {
                const title = '매칭 거절됨';
                const body = '상대방이 매칭 요청을 거절했습니다.';
                await sendFirebaseNotification(requester.firebase_token, title, body);
            }
        } else {
            res.status(400).json({ error: 'Invalid action.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to respond to match request.' });
    }
};



