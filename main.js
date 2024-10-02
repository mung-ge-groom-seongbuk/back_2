require('dotenv').config({ path: './.env' });

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./models/index'); // 모든 모델 가져오기
const signInController = require('./controllers/signinControllers');
const loginoutController = require('./controllers/loginoutControllers');
const nicknameController = require('./controllers/nicknameControllers');

const app = express();

// 미들웨어 설정
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(flash());

// 기본 경로에 대한 라우트 추가
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 회원가입 라우트 등록
app.post('/signup', signInController.signUp);
app.post('/login', loginoutController.authenticate, loginoutController.redirectView);
app.post('/logout', loginoutController.logout);
app.post('/updateProfile', nicknameController.updateProfile);

// 대시보드 라우트 (예시)
app.get('/dashboard', (req, res) => {
    res.send('Welcome to the dashboard!');
});

// 404 에러 핸들러
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// 일반적인 에러 핸들러
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('서버 내부 오류');
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});








