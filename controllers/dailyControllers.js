// daily
const { Op } = require("sequelize"); // Op 객체 불러오기
const { DailyData, RunningData } = require("../models"); // Daily_Data, Running_Data 모델 불러오기

// 하루의 달리기 기록 저장
exports.saveDailyRunData = async (req, res) => {
    const { userId, date } = req.body;

    try {
        // 주어진 날짜의 달리기 기록 조회
        const runningData = await RunningData.findAll({
            where: {
                user_id: userId,
                recorded_at: {
                    [Op.gte]: new Date(date), // 시작 날짜
                    [Op.lt]: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) // 종료 날짜 (다음 날 00:00)
                }
            }
        });

        // 총 거리, 총 달리기 횟수, 최대 페이스, 평균 페이스, 총 소요 시간, 총 소모 칼로리 계산
        const totalDistance = runningData.reduce((acc, record) => acc + record.distance_km, 0);
        const totalCalories = runningData.reduce((acc, record) => acc + record.calories, 0); // 총 소모 칼로리
        const totalRuns = runningData.length; // 총 달리기 횟수

        let totalDurationInSeconds = 0; // 총 소요 시간 (초 단위)
        let maxPaceInSeconds = 0; // 최대 페이스 (초 단위)
        
        runningData.forEach(record => {
            const [hours, minutes, seconds] = record.duration.split(':').map(Number);
            const durationInSeconds = hours * 3600 + minutes * 60 + seconds;
            totalDurationInSeconds += durationInSeconds;

            // 현재 주행의 페이스 계산 (초당 거리)
            const paceInSeconds = durationInSeconds / record.distance_km; // 주행 시간(초) / 거리(킬로미터)
            if (maxPaceInSeconds === 0 || paceInSeconds > maxPaceInSeconds) {
                maxPaceInSeconds = paceInSeconds; // 최대 페이스 갱신
            }
        });

        // 평균 페이스 계산 (초 단위)
        const avgPaceInSeconds = totalRuns > 0 ? totalDurationInSeconds / totalDistance : null;

        // HH:MM:SS 형식으로 변환하는 함수
        const formatPace = (paceInSeconds) => {
            if (paceInSeconds === null) return null;
            const minutes = Math.floor(paceInSeconds / 60);
            const seconds = Math.round(paceInSeconds % 60);
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        };

        // Daily_Data 테이블에 기록 저장
        const dailyRecord = await DailyData.create({
            user_id: userId,
            date: date,
            total_distance: totalDistance,
            total_duration: new Date(totalDurationInSeconds * 1000).toISOString().substr(11, 8), // HH:MM:SS 형식으로 변환
            total_calories: totalCalories,
            total_run_count: totalRuns, // 총 달린 횟수
            max_pace: formatPace(maxPaceInSeconds), // 최대 페이스
            avg_pace: formatPace(avgPaceInSeconds), // 평균 페이스
            created_at: new Date()
        });

        res.status(201).json({ message: "하루치 달리기 기록이 저장되었습니다.", dailyRecord });
    } catch (error) {
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
        res.status(500).json({ message: "기록 요약 조회 중 오류 발생.", error });
    }
};





