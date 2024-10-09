require('dotenv').config({ path: './.env' });

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./models/index');
const firebaseAdmin = require('./config/firebase'); // Firebase 설정 파일 불러오기
const signInController = require('./controllers/signinControllers');
const loginoutController = require('./controllers/loginoutControllers');
const nicknameController = require('./controllers/nicknameControllers');
const matchController = require('./controllers/matchControllers');
const notificationController = require('./controllers/notificationControllers');
const chatController = require('./controllers/chatControllers');
const mapController = require('./controllers/mapControllers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false // 세션이 새로 생성되었을 때만 저장
}));
app.use(flash());

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Firebase Cloud Messaging 사용 예시
const sendFirebaseNotification = async (registrationToken, payload) => {
    try {
        await firebaseAdmin.messaging().sendToDevice(registrationToken, payload);
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

// Socket.IO 설정
io.on('connection', (socket) => {
    console.log('A user connected');

    // 메시지 수신 이벤트
    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// 기본 경로에 대한 라우트 추가
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// 회원가입 및 로그인 라우트 등록
app.post('/signup', signInController.signUp);
app.post('/login', loginoutController.authenticate, loginoutController.redirectView);
app.post('/logout', loginoutController.logout);
app.post('/updateProfile', upload.single('profile_picture'), nicknameController.updateProfile);

// 매칭 라우트 등록
app.get('/matches', matchController.getNearbyUsers); // 사용자 목록 조회
app.post('/matches/send', matchController.sendMatchRequest); // 매칭 요청 전송

// 알림 라우트 등록
app.get('/notifications', notificationController.getMatchNotifications); // 매칭 알림 확인
app.post('/notifications/respond', notificationController.respondToMatch); // 매칭 요청 수락/거절

// 채팅 라우트 등록
app.post('/chat/send', chatController.sendMessage); // 메시지 전송
app.get('/chat/messages/:sender_id/:receiver_id', chatController.getMessages); // 메시지 조회

// 지도 라우트 등록
app.get('/map', mapController.getMatchedUsersLocation); // 사용자 위치 조회

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
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});












