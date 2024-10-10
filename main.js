require('dotenv').config({ path: './.env' });

const { sendFirebaseNotification } = require('./config/firebase'); // firebaseAdmin 대신 sendFirebaseNotification 가져오기
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./models/index');
const { sendMatchRequest } = require('./controllers/matchControllers'); // 매칭 요청 처리 함수 가져오기
const authenticateJWT = require('./middleware/authenticateJWT'); // JWT 인증 미들웨어 가져오기
const { getMatchedUsersLocation } = require('./controllers/mapControllers');

//const firebaseAdmin = require('./config/firebase'); 
const signInController = require('./controllers/signinControllers');
const loginoutController = require('./controllers/loginoutControllers');
const nicknameController = require('./controllers/nicknameControllers');
const matchController = require('./controllers/matchControllers');
const notificationController = require('./controllers/notificationControllers');
const chatController = require('./controllers/chatControllers');
const mapController = require('./controllers/mapControllers');
const userController = require('./controllers/userControllers');
const runController = require('./controllers/runControllers');
const dailyController = require('./controllers/dailyControllers');
const goalController = require('./controllers/goalControllers');
const runprofileController = require('./controllers/runprofileControllers');
const userLocationController = require('./controllers/userLocationControllers');
const path = require('path');

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



// 푸시 알림 테스트 라우트
/*app.post('/test-notification', async (req, res) => {
    const { token } = req.body; // 요청 본문에서 토큰을 가져옴

    if (!token) {
        return res.status(400).json({ error: '토큰을 제공해야 합니다.' });
    }

    const payload = {
        notification: {
            title: '테스트 알림',
            body: '푸시 알림이 성공적으로 전송되었습니다!',
        },
    

    try {
        await sendFirebaseNotification(token, payload); // 수정된 부분
        res.status(200).json({ message: '푸시 알림이 성공적으로 전송되었습니다.' });
    } catch (error) {
        console.error('푸시 알림 전송 오류:', error);
        res.status(500).json({ error: '푸시 알림 전송에 실패했습니다.' });
    }
});*/



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

// uploads 디렉토리를 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
// 매칭 요청 API 경로
app.post('/matching-request', authenticateJWT, sendMatchRequest); //매칭 요청 전송

// 알림 라우트 등록
app.get('/notifications', notificationController.getMatchNotifications); // 매칭 알림 확인
app.post('/notifications/respond', notificationController.respondToMatch); // 매칭 요청 수락/거절

// 채팅 라우트 등록
app.post('/chat/send', chatController.sendMessage); // 메시지 전송
app.get('/chat/messages/:sender_id/:receiver_id', chatController.getMessages); // 메시지 조회

// 지도 라우트 등록
//app.get('/map', mapController.getMatchedUsersLocation); // 사용자 위치 조회
// 지도 라우트 등록
app.get('/matched-users-location', authenticateJWT, mapController.getMatchedUsersLocation); // 사용자 위치 조회


// DailyData 관련 라우트 등록
app.post('/daily/runs', dailyController.saveDailyRunData); // 하루의 달리기 기록 저장
app.get('/daily/summary/:userId', dailyController.getDailySummary); // 사용자 달리기 기록 요약 조회

// RunningData 관련 라우트 등록
app.post('/running', runController.startRun); // 달리기 기록 시작 및 저장
app.get('/running/:userId', runController.getRunRecords); // 사용자 달리기 기록 조회

// Goal 관련 라우트 등록
app.post('/goals', goalController.setGoal); // 목표 설정
app.get('/goals/:userId', goalController.getGoals); // 사용자 목표 조회

// 사용자 프로필 조회 라우트 등록
app.get('/profile/:userId', runprofileController.getUserProfile); // 사용자 프로필 조회

// 사용자 위치 라우트 등록
app.post('/user/location/update', userLocationController.updateUserLocation); // 사용자 위치 업데이트


app.get('/users', userController.getAllUsers); // 모든 유저 정보 조회

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








