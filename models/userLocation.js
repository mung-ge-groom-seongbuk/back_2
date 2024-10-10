//userLocation table

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const UserLocation = sequelize.define("UserLocation", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { // 외래 키 설정
                model: "user", // 참조할 테이블
                key: "user_id" // 참조할 테이블의 필드
            }
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6), // 위도는 소수점 여섯 자리까지 허용
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6), // 경도는 소수점 여섯 자리까지 허용
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // 기본값: CURRENT_TIMESTAMP
        }
    },
    {
        tableName: "userLocation", // 테이블명 설정
        timestamps: false // createdAt, updatedAt 자동 생성 방지
    });

    // UserLocation 모델
    UserLocation.associate = (models) => {
        UserLocation.belongsTo(models.User, { foreignKey: 'user_id' });
};
    return UserLocation;
}
