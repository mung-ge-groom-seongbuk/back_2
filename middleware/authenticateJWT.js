const jwt = require('jsonwebtoken');

// JWT 인증 미들웨어
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        const bareToken = token.split(' ')[1]; // "Bearer <token>" 형식에서 토큰 추출
        jwt.verify(bareToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "로그인이 필요합니다." });
            }
            req.user = user; // 유저 정보 저장
            next();
        });
    } else {
        return res.status(403).json({ error: "로그인이 필요합니다." });
    }
};

module.exports = authenticateJWT; // 모듈 내보내기