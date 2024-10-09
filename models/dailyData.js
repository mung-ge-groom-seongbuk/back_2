const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const DailyData = sequelize.define("DailyData", {
        daily_id: {
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
        date: {
            type: DataTypes.DATEONLY,
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
            type: DataTypes.DECIMAL(5, 2),
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
        total_run_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '하루에 총 달린 횟수'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "dailyData",
        timestamps: false
    });
    return DailyData;
}
