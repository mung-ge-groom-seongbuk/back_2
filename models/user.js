const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("User", { // 엔티티 생성
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // AUTO_INCREMENT 설정
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true, // Unique Key 설정
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: true, //NULL 허용
            defaultValue: '',
        },
        profile_picture: {
            type: DataTypes.STRING(255),
            allowNull: true // NULL 허용
        },
        intro: {
            type: DataTypes.STRING(255),
            allowNull: true // NULL 허용
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // 기본값: CURRENT_TIMESTAMP
        }
    }, 
    {
        tableName: "user", // 테이블명 설정
        timestamps: false // createdAt, updatedAt 자동 생성 방지
    });

    // User와 RunningData 관계 설정
    User.associate = (models) => {
        User.hasMany(models.RunningData, { foreignKey: 'user_id' });
        User.hasOne(models.UserLocation, { foreignKey: 'user_id' }); // UserLocation과의 관계 추가
    };

    return User;
};
