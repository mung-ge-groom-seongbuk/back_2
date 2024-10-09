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
        goal_type: {
            type: DataTypes.ENUM('distance', 'calories'),
            allowNull: false,
            comment: '목표 종류 (거리 또는 칼로리)'
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
