//chat table

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Chat = sequelize.define("chat", {
        chat_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // AUTO_INCREMENT 설정
            allowNull: false
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { // 외래 키 설정 (발신자)
                model: "user", // 참조할 테이블
                key: "user_id" // 참조할 테이블의 필드
            }
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { // 외래 키 설정 (수신자)
                model: "user", // 참조할 테이블
                key: "user_id" // 참조할 테이블의 필드
            }
        },
        message: {
            type: DataTypes.STRING(500), // 메시지 내용 최대 500자
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // 기본값: CURRENT_TIMESTAMP
        }
    },
    {
        tableName: "chat", // 테이블명 설정
        timestamps: false // createdAt, updatedAt 자동 생성 방지
    });
    return Chat;
}
