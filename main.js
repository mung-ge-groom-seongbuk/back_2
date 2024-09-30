const express = require('express');
const { Sequelize } = require('sequelize');
const UserModel = require('./models/user'); // 경로를 실제 파일 위치에 맞게 조정해

const app = express();
const PORT = process.env.PORT || 3000;

// Sequelize 데이터베이스 연결 설정
const sequelize = new Sequelize('gooroom_db', 'cc', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

// User 모델 초기화
const User = UserModel(sequelize);

// 데이터베이스 연결 및 테이블 생성
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate(); // 데이터베이스 연결 확인
        console.log('Database connection has been established successfully.');

        await sequelize.sync({ force: true }); // 테이블 생성 (기존 테이블을 삭제하고 새로 생성)
        console.log('User table has been created successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    initializeDatabase(); // 데이터베이스 초기화
});
