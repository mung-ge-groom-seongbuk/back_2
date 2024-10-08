//notification table

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Notification = sequelize.define("Notification", {
        notification_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // AUTO_INCREMENT 설정
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { // 외래 키 설정
                model: "user", // 참조할 테이블
                key: "user_id" // 참조할 테이블의 필드
            }
        },
        match_notification: {
            type: DataTypes.ENUM('on'), // 매칭 요청 알림
            allowNull: false,
            defaultValue: 'on' // 기본값 설정
        },
        chat_notification: {
            type: DataTypes.ENUM('on'), // 채팅 알림
            allowNull: false,
            defaultValue: 'on' // 기본값 설정
        }
    },
    {
        tableName: "notification", // 테이블명 설정
        timestamps: false // createdAt, updatedAt 자동 생성 방지
    });
    return Notification;
}
