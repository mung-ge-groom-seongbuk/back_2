//나의 위치 업데이트

/*const { UserLocation } = require('../models');

// 사용자 위치 정보 업데이트
exports.updateUserLocation = async (req, res) => {
    const user = req.user; // JWT로 인증된 사용자 정보 가져오기
    const { longitude, latitude } = req.body; // 요청에서 경도와 위도를 가져옵니다.

    if (!longitude || !latitude) {
        return res.status(400).json({ error: '경도와 위도를 제공해야 합니다.' });
    }

    try {
        // 사용자 위치 정보 업데이트
        const [location, created] = await UserLocation.upsert({
            user_id: user.user_id,
            longitude,
            latitude,
            updated_at: new Date() // 현재 시간으로 업데이트
        }, { returning: true });

        return res.status(200).json({ message: '위치 정보가 업데이트되었습니다.', location });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: '위치 정보 업데이트에 실패했습니다.' });
    }
};*/

