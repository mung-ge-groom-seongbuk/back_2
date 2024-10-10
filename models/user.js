const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("User", { 
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
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
            allowNull: true,
            defaultValue: '',
        },
        profile_picture: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        intro: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, 
    {
        tableName: "user",
        timestamps: false
    });

    User.associate = (models) => {
        User.hasMany(models.RunningData, { foreignKey: 'user_id' });
        User.hasMany(models.DailyData, { foreignKey: 'user_id' });
        User.hasMany(models.Goal, { foreignKey: 'user_id' });
        User.hasMany(models.Matching, { foreignKey: 'requester_id', as: 'requests' }); // 요청자
        User.hasMany(models.Matching, { foreignKey: 'responder_id', as: 'responses' }); // 응답자
        User.hasOne(models.UserLocation, { foreignKey: 'user_id' });
        User.hasOne(models.Notification, { foreignKey: 'user_id' });
        User.hasMany(models.Chat, { foreignKey: 'sender_id' });
        User.hasMany(models.Chat, { foreignKey: 'receiver_id' });
    };

    return User;
};



