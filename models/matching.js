const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Matching = sequelize.define("Matching", {
        match_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        requester_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        responder_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        message: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("requested", "accepted", "rejected"),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, 
    {
        tableName: "matching",
        timestamps: false
    });

    Matching.associate = (models) => {
        Matching.belongsTo(models.User, { foreignKey: 'requester_id', as: 'requester' }); // 요청자
        Matching.belongsTo(models.User, { foreignKey: 'responder_id', as: 'responder' }); // 응답자
    };

    return Matching;
};

