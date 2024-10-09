const { Goal } = require("../models"); // Goal 모델 불러오기

// 목표 설정
exports.setGoal = async (req, res) => {
    const { userId, goal_name, end_date, goal_km, goal_calories } = req.body;

    try {
        const goal = await Goal.create({
            user_id: userId,
            goal_name,
            end_date,
            goal_km: goal_km || null, // goal_km이 제공되지 않으면 null로 설정
            goal_calories: goal_calories || null, // goal_calories가 제공되지 않으면 null로 설정
            created_at: new Date()
        });
        res.status(201).json({ message: "목표가 설정되었습니다.", goal });
    } catch (error) {
        res.status(500).json({ message: "목표 설정 중 오류 발생.", error });
    }
};

// 목표 목록 조회
exports.getGoals = async (req, res) => {
    const { userId } = req.params;

    try {
        const goals = await Goal.findAll({ where: { user_id: userId } });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: "목표 조회 중 오류 발생.", error });
    }
};

