// firebase.js
const admin = require('firebase-admin');

// Firebase Admin SDK 서비스 계정 키 경로
const serviceAccount = require('./serviceAccountKey.json'); // config 폴더 내에 있는 경우, 경로 수정

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


