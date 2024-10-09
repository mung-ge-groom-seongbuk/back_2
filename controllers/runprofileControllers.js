//profile  view
const { User, RunningData } = require("../models"); // User 및 Running_Data 모델 불러오기

// 사용자 프로필 조회
exports.getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByPk(userId);
        const runs = await RunningData.findAll({ where: { user_id: userId } });

        // 월 평균 회수 및 거리 계산
        const averageRunsPerMonth = runs.length / 30; // 대략적인 월 평균 (30일 기준)
        const averageDistance = runs.reduce((acc, record) => acc + record.distance_km, 0) / runs.length || 0; // 월 평균 거리
        const averagePace = runs.reduce((acc, record) => acc + record.pace, 0) / runs.length || 0; // 월 평균 페이스

        res.status(200).json({
            nickname: user.nickname,
            name: user.name,
            profile_picture: user.profile_picture,
            average_runs_per_month: averageRunsPerMonth,
            average_distance: averageDistance,
            average_pace: averagePace
        });
    } catch (error) {
        res.status(500).json({ message: "프로필 조회 중 오류 발생.", error });
    }
};
