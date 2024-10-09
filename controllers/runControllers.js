//러닝 관련 ..
const { RunningData } = require("../models"); // Running_Data 모델 불러오기

// 시작 및 정지 기록 기능
exports.startRun = async (req, res) => {
    // 사용자가 달리기 시작
    const { userId, distance, duration, pace, calories } = req.body;

    try {
        const runRecord = await RunningData.create({
            user_id: userId,
            distance_km: distance,
            duration: duration,
            pace: pace,
            calories: calories,
            recorded_at: new Date()
        });
        res.status(201).json({ message: "달리기 기록이 저장되었습니다.", runRecord });
    } catch (error) {
        res.status(500).json({ message: "달리기 기록 저장 중 오류 발생.", error });
    }
};

// 사용자 달리기 기록 보기
exports.getRunRecords = async (req, res) => {
    const { userId } = req.params;

    try {
        const records = await RunningData.findAll({ where: { user_id: userId } });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "기록 조회 중 오류 발생.", error });
    }
};
