require('dotenv').config({ path: './.env' }); // dotenv 패키지 로드
const express = require('express');
const app = express();

const { Sequelize } = require('sequelize');
const UserModel = require('./models/user'); // User 모델 파일 경로
const MatchingModel = require('./models/matching');
const RunningDataModel = require('./models/runningData');
const DailyDataModel = require('./models/dailyData');
const GoalModel = require('./models/goal');
const ChatModel = require('./models/chat');
const NotificationModel = require('./models/notification');
const UserLocationModel = require('./models/userLocation');

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
const RunningData = RunningDataModel(sequelize);
const DailyData = DailyDataModel(sequelize);
const Goal = GoalModel(sequelize);
const Chat = ChatModel(sequelize);
const Notification = NotificationModel(sequelize);
const UserLocation = UserLocationModel(sequelize);

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

// 포트 설정 (80번 포트)
app.set('port', 3000);

// 기본 경로에 대한 응답 설정
app.get('/', (req, res) => {
    res.send('Hello, you have reached the server!');
});

// 서버 시작
app.listen(app.get('port'), () => {
    console.log(`Server running on port: ${app.get('port')}`);
});





