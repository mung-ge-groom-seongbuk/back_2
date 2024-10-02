require('dotenv').config({ path: './.env' }); // dotenv 패키지 로드

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session'); // 세션 미들웨어
const flash = require('connect-flash'); // 플래시 메시지 미들웨어
const { Sequelize } = require('sequelize');
const UserModel = require('./models/user'); // User 모델 파일 경로
const MatchingModel = require('./models/matching');
const RunningDataModel = require('./models/runningData');
const DailyDataModel = require('./models/dailyData');
const GoalModel = require('./models/goal');
const ChatModel = require('./models/chat');
const NotificationModel = require('./models/notification');
const UserLocationModel = require('./models/userLocation');
const signInController = require('./controllers/signinControllers'); // 회원가입 컨트롤러 가져오기
const loginoutController = require('./controllers/loginoutController');

const { authenticate, redirectView, logout } = require('./controllers/loginoutController'); // 로그인/로그아웃 컨트롤러 가져오기

const app = express();

// 미들웨어 설정
app.use(bodyParser.json()); // JSON 요청 파싱
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true })); // 세션 설정
app.use(flash()); // 플래시 메시지 설정

// 기본 경로에 대한 라우트 추가
app.get('/', (req, res) => {
    res.send('Hello, World!'); // 기본 응답
});

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // 포트 추가
    dialect: 'mysql',
    logging: console.log // 쿼리 로그 출력
});

// 모델 초기화
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

// 회원가입 라우트 등록
app.post('/signup', signInController.signUp); // 회원가입 라우트 등록
// 로그인 라우트
app.post('/login', authenticate, redirectView); // 로그인 라우트 등록
app.post('/logout', loginoutController.logout); // 로그아웃 라우트 등록

// 대시보드 라우트 (예시)
app.get('/dashboard', (req, res) => {
    res.send('Welcome to the dashboard!'); // 대시보드 기본 응답
});

// 서버 시작
const PORT = process.env.PORT || 3000; // 포트 설정
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







