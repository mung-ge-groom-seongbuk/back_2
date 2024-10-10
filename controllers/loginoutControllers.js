const db = require("../models/index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User, UserLocation } = db; // User와 UserLocation 모델 모두 가져오기

// 로그인
exports.authenticate = async (req, res) => {
    const { email, password, latitude, longitude } = req.body; // 위치 정보 추가
    try {
        // 이메일로 사용자 조회
        const user = await User.findOne({ where: { email: email } });

        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        if (user && await bcrypt.compare(password, user.password)) {
            // JWT 토큰 생성
            const token = jwt.sign(
                { user_id: user.user_id, email: user.email },
                config.development.sessionSecret,
                { expiresIn: '1h' }
            );

            // 생성된 토큰을 DB에 저장
            await user.update({ token });

            // 사용자의 위치 정보를 UserLocation 테이블에 저장
            await UserLocation.upsert({
                user_id: user.user_id,
                latitude: latitude,
                longitude: longitude
            });

            // 세션에 user_id 저장
            req.session.user_id = user.user_id;

            res.cookie('auth_token', token, {
                httpOnly: true, // JavaScript로 쿠키 접근 불가 (보안 강화)
                secure: false, // HTTPS에서만 쿠키 전송 (개발 시에는 false로 설정)
                maxAge: 60 * 60 * 1000 // 쿠키 만료 시간 (1시간)
            });

            // 응답으로 토큰 전송
            return res.status(200).json({ message: "로그인 성공!", token, redirectUrl: '/dashboard' });
        } else {
            return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        }
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        return res.status(500).send('서버 내부 오류');
    }
};

// 로그아웃
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('로그아웃 실패');
        }
        res.redirect('/login'); // 로그인 페이지로 리다이렉트
    });
};

// 리다이렉트 처리
exports.redirectView = (req, res) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) {
        res.redirect(redirectPath);
    } else {
        res.status(500).send('리다이렉트 경로가 설정되지 않았습니다.');
    }
};






