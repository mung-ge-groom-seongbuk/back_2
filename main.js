require('dotenv').config({ path: './.env' }); // dotenv 패키지 로드

const { Sequelize } = require('sequelize');
const UserModel = require('./models/user'); // User 모델 파일 경로

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

// User 모델 정의
const User = UserModel(sequelize); // User 모델 초기화

// 데이터베이스 연결 확인 및 동기화
const test = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // 데이터베이스와 동기화하여 테이블 생성
        await sequelize.sync(); // 테이블 생성 (이미 존재하면 무시)
        console.log('User table has been created (if it did not exist).');

        // 예시 쿼리 (reservation 테이블을 사용하려면 필요에 따라 수정)
        let sql = 'SELECT * FROM reservation';
        let [rows, fields] = await sequelize.query(sql);
        console.log(rows);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// 테스트 실행
test();


