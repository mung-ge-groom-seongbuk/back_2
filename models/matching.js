//matchig table 

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Matching = sequelize.define("matching", {
        match_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // AUTO_INCREMENT 설정
            allowNull: false
        },
        requester_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',  // 외래키로 user 테이블을 참조
                key: 'user_id'
            },
            onDelete: 'CASCADE', // 유저 삭제 시 매칭 정보도 삭제
            onUpdate: 'CASCADE'
        },
        responder_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',  // 외래키로 user 테이블을 참조
                key: 'user_id'
            },
            onDelete: 'CASCADE', // 유저 삭제 시 매칭 정보도 삭제
            onUpdate: 'CASCADE'
        },
        message: {
            type: DataTypes.STRING(500),
            allowNull: true // 메세지는 NULL 허용
        },
        status: {
            type: DataTypes.ENUM("requested", "accepted", "rejected"),
            allowNull: false // 상태는 NULL 불가
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // 기본값: CURRENT_TIMESTAMP
        }
    }, 
    {
        tableName: "matching", // 테이블명 설정
        timestamps: false // createdAt, updatedAt 자동 생성 방지
    });
    return Matching;
}
