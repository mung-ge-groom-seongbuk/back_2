//daily_data table

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const DailyData = sequelize.define("DailyData", {
        daily_id: {
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
        date: {
            type: DataTypes.DATEONLY, // 날짜만 저장
            allowNull: false
        },
        max_pace: {
            type: DataTypes.TIME,
            allowNull: false
        },
        avg_pace: {
            type: DataTypes.TIME,
            allowNull: false
        },
        total_distance: {
            type: DataTypes.DECIMAL(5, 2), // 소수점 두 자리까지 허용
            allowNull: false
        },
        total_duration: {
            type: DataTypes.TIME,
            allowNull: false
        },
        total_calories: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // 기본값: CURRENT_TIMESTAMP
        }
    }, 
    {
        tableName: "dailyData", // 테이블명 설정
        timestamps: false // createdAt, updatedAt 자동 생성 방지
    });
    return DailyData;
}
