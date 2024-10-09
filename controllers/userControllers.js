const db = require('../models/index'); // models/index.js에서 Sequelize 인스턴스 가져오기
const { User } = require('../models');

// 모든 유저 정보 조회 함수
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll(); // 비밀번호와 토큰 포함한 모든 필드 조회
        res.status(200).json(users); // 유저 정보 JSON으로 응답
    } catch (error) {
        console.error("유저 정보 조회 실패:", error);
        res.status(500).json({ error: "유저 정보를 조회하는 중 오류가 발생했습니다." });
    }
};
