// firebase.js
const admin = require('firebase-admin');

// Firebase Admin SDK 서비스 계정 키 경로
const serviceAccount = require('./path/to/your/firebase-service-account-key.json'); // 경로를 실제 키 파일 경로로 수정하세요.

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const sendFirebaseNotification = async (registrationToken, payload) => {
    try {
        await admin.messaging().sendToDevice(registrationToken, payload);
        console.log('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { sendFirebaseNotification };

