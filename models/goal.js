const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Goal = sequelize.define("Goal", {
        goal_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "user",
                key: "user_id"
            }
        },
        goal_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        goal_value: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            comment: '목표 종료 날짜'
        },
        goal_km: { // 목표 거리
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: '목표 달리고자 하는 거리'
        },
        goal_calories: { // 목표 칼로리
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: '목표 소모하고자 하는 칼로리'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "goal",
        timestamps: false
    });
    return Goal;
}
