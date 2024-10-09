const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RunningData = sequelize.define("RunningData", {
        run_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        distance_km: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: '러닝한 거리 (km)'
        },
        duration: {
            type: DataTypes.TIME,
            allowNull: false,
            comment: '러닝에 소요된 시간'
        },
        pace: {
            type: DataTypes.TIME,
            allowNull: false,
            comment: '1km당 소요된 시간 (페이스)'
        },
        calories: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '러닝 중 소모한 칼로리'
        },
        run_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '달린 횟수'
        },
        recorded_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            comment: '러닝 기록 일자'
        }
    },
    {
        tableName: "runningData",
        timestamps: false
    });

    RunningData.associate = (models) => {
        RunningData.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return RunningData;
};

