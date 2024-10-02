// 로그인 로그아웃

const db = require("../models/index");
const User = db.user; // 기존 유저 테이블 사용
const bcrypt = require('bcrypt');

exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // 이메일로 사용자 조회
        const user = await User.findOne({ where: { email: email } });

        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        if (user && await bcrypt.compare(password, user.password)) {
            req.flash("success", "로그인 성공!");
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            res.locals.redirect = '/dashboard'; // 로그인 후 리다이렉트할 경로
            return next(); // 리다이렉트 경로 설정 후 다음 미들웨어로 이동
        } else {
            req.flash("error", "이메일 또는 비밀번호가 올바르지 않습니다. 다시 시도해주세요.");
            res.locals.redirect = '/login'; // 로그인 페이지로 리다이렉트
            return next(); // 리다이렉트 경로 설정 후 다음 미들웨어로 이동
        }
    } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        return res.status(500).send('서버 내부 오류'); // 에러 발생 시 적절한 응답
    }
};

exports.redirectView = (req, res) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) {
        res.redirect(redirectPath);
    } else {
        res.status(500).send('리다이렉트 경로가 설정되지 않았습니다.');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('로그아웃 실패');
        }
        res.redirect('/login'); // 로그인 페이지로 리다이렉트
    });
};

