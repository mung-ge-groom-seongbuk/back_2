// firebase.js
const admin = require('firebase-admin');

// Firebase Admin SDK 서비스 계정 키 경로
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const sendFirebaseNotification = async (registrationToken, title, body) => {
    const payload = {
        notification: {
            title: title,
            body: body,
        },
        token: registrationToken // registrationToken을 payload에 포함
    };

    try {
        // FCM에 알림을 전송합니다.
        const response = await admin.messaging().send(payload); // payload를 전송
        console.log('Notification sent successfully:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};


module.exports = { sendFirebaseNotification };




