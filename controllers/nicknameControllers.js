const db = require("../models/index");
const { User } = require('../models'); // User 모델 불러오기
const path = require('path');

exports.updateProfile = async (req, res) => {
    // req.body로부터 email, nickname, intro 추출
    const { email, nickname, intro } = req.body;
    const profile_picture = req.file ? req.file.path : null; // multer를 사용하여 파일 경로를 가져옴

    // 프로필 사진의 URL 생성
    const profilePictureUrl = profile_picture ? `${req.protocol}://${req.get('host')}/${profile_picture}` : null;

    // 이메일 값이 제대로 들어오는지 확인하는 로그 추가
    console.log("Received email:", email);

    // 이메일이 제공되지 않은 경우 처리
    if (!email) {
        return res.status(400).json({ message: "이메일이 필요합니다." });
    }

    try {
        // 이메일로 사용자 조회
        const user = await User.findOne({ where: { email: email } });

        // 사용자가 존재하지 않을 경우
        if (!user) {
            return res.status(404).json({ message: '해당 이메일로 가입된 사용자를 찾을 수 없습니다.' });
        }

        // 사용자의 닉네임, 프로필 사진, 한 줄 소개 업데이트
        await User.update(
            {
                nickname: nickname || user.nickname, // 닉네임이 없을 경우 기존 값을 유지
                intro: intro || user.intro, // 한 줄 소개가 없을 경우 기존 값을 유지
                profile_picture: profilePictureUrl || user.profile_picture, // 프로필 사진 URL 업데이트
            },
            {
                where: { email: email }, // 이메일 기준으로 업데이트
            }
        );

        res.status(200).json({
            message: "프로필이 성공적으로 업데이트되었습니다.",
            profile_picture: profilePictureUrl, // URL도 응답에 포함
        });
    } catch (error) {
        console.error('프로필 업데이트 중 오류 발생:', error);
        res.status(500).json({ message: "서버 내부 오류" });
    }
};



