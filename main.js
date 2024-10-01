require('dotenv').config({ path: './.env' }); // dotenv 패키지 로드

const { Sequelize } = require('sequelize');
const UserModel = require('./models/user'); // User 모델 파일 경로
const MatchingModel = require('./models/matching');

// 환경 변수 출력
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // 포트 추가
    dialect: 'mysql',
    logging: console.log // 쿼리 로그 출력
});

const User = UserModel(sequelize);
const Matching = MatchingModel(sequelize);

// 데이터베이스 연결 및 테이블 생성
const test = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // 테이블 생성
        await sequelize.sync(); // 모든 모델을 데이터베이스에 동기화
        console.log('User table has been created (if it did not exist).');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

test();

