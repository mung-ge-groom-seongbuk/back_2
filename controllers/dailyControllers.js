// daily
const { Op } = require("sequelize"); // Op 객체 불러오기
const { DailyData, RunningData } = require("../models"); // Daily_Data, Running_Data 모델 불러오기

// 하루의 달리기 기록 저장
exports.saveDailyRunData = async (req, res) => {
    const { userId, date } = req.body;

    try {
        // 주어진 날짜의 달리기 기록 조회
        const dailyRecords = await RunningData.findAll({
            where: {
                user_id: userId,
                recorded_at: {
                    [Op.gte]: new Date(new Date(date).setHours(0, 0, 0, 0)), // 시작 날짜 (해당 날짜의 시작)
                    [Op.lt]: new Date(new Date(date).setHours(23, 59, 59, 999)) // 종료 날짜 (해당 날짜의 끝)
                }
            }
        });

        // 총 거리, 총 달리기 횟수, 최대 페이스, 평균 페이스, 총 소요 시간, 총 소모 칼로리 계산
        const totalDistance = dailyRecords.reduce((acc, record) => acc + record.distance_km, 0);
        const totalDuration = dailyRecords.reduce((acc, record) => acc + record.duration, 0); // 총 소요 시간
        const totalCalories = dailyRecords.reduce((acc, record) => acc + record.calories, 0); // 총 소모 칼로리
        const totalRuns = dailyRecords.length; // 총 달리기 횟수
        const maxPace = totalRuns > 0 ? Math.max(...dailyRecords.map(record => record.pace)) : 0; // 최대 페이스
        const avgPace = totalRuns > 0 ? totalDistance / totalRuns : 0; // 평균 페이스 계산

        // Daily_Data 테이블에 기록 저장
        const dailyRecord = await DailyData.create({
            user_id: userId,
            date: date,
            total_distance: totalDistance,
            total_duration: totalDuration,
            total_calories: totalCalories,
            total_run_count: totalRuns, // 총 달린 횟수
            max_pace: maxPace,
            avg_pace: avgPace,
            created_at: new Date()
        });

        res.status(201).json({ message: "하루치 달리기 기록이 저장되었습니다.", dailyRecord });
    } catch (error) {
        console.error(error); // 에러 로그 출력
        res.status(500).json({ message: "하루치 달리기 기록 저장 중 오류 발생.", error });
    }
};

// 사용자 달리기 기록 요약
exports.getDailySummary = async (req, res) => {
    const { userId } = req.params;

    try {
        const summaries = await DailyData.findAll({ where: { user_id: userId } });
        res.status(200).json(summaries);
    } catch (error) {
        console.error(error); // 에러 로그 출력
        res.status(500).json({ message: "기록 요약 조회 중 오류 발생.", error });
    }
};



