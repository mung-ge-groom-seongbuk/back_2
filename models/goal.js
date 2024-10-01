//goal table

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Goal = sequelize.define("goal", {
        goal_id: {
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
        goal_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        goal_value: {
            type: DataTypes.DECIMAL(5, 2), // 소수점 두 자리까지 허용
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // 기본값: CURRENT_TIMESTAMP
        }
    },
    {
        tableName: "goal", // 테이블명 설정
        timestamps: false // createdAt, updatedAt 자동 생성 방지
    });
    return Goal;
}
