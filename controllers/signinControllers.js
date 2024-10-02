//회원가입

const { User } = require('../models'); // User 모델 불러오기
const config = require('../config/config');

// 회원가입 컨트롤러
const signUp = async (req, res) => {
    const { name, email, phone_number, password } = req.body;

    try {
        // 중복된 이메일 검사
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
        }

        // 새 사용자 생성
        const newUser = await User.create({
            name,
            email,
            phone_number,
            password // 비밀번호 해시는 추후 적용 가능
        });

        return res.status(201).json({ message: '회원가입이 완료되었습니다.', user: newUser });
    } catch (error) {
        console.error('회원가입 중 에러 발생:', error);
        return res.status(500).json({ message: '서버 에러 발생' });
    }
};

module.exports = { signUp };
