const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const RunningData = sequelize.define("RunningData", {
        run_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // AUTO_INCREMENT 설정
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',  // 외래키로 user 테이블을 참조
                key: 'user_id'
            },
            onDelete: 'CASCADE', // 유저 삭제 시 관련 러닝 데이터도 삭제
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
        recorded_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, // 기본값: CURRENT_TIMESTAMP
            comment: '러닝 기록 일자'
        }
    }, 
    {
        tableName: "runningData", // 테이블명 설정
        timestamps: false // createdAt, updatedAt 자동 생성 방지
    });

    // RunningData와 User 관계 설정
    RunningData.associate = (models) => {
        RunningData.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return RunningData;
};

