//프로필 사진 등록, 닉네임 설정


const db = require("../models/index");
const User = db.user; // User 모델 가져오기

exports.updateProfile = async (req, res) => {
    const { user_id, nickname, intro } = req.body;
    const profile_picture = req.file ? req.file.path : null; // multer를 사용하여 파일 경로를 가져온다고 가정

    try {
        // 사용자의 닉네임과 한 줄 소개 업데이트
        await User.update(
            {
                nickname: nickname,
                intro: intro,
                profile_picture: profile_picture, // 프로필 사진 경로 업데이트
            },
            {
                where: { id: user_id }, // 특정 사용자 조회
            }
        );

        res.status(200).json({
            message: "프로필이 성공적으로 업데이트되었습니다.",
        });
    } catch (error) {
        console.error('프로필 업데이트 중 오류 발생:', error);
        res.status(500).json({ message: "서버 내부 오류" });
    }
};
