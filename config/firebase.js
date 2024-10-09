// firebase.js
const admin = require('firebase-admin');

// Firebase Admin SDK 서비스 계정 키 경로
const serviceAccount = require('./serviceAccountKey.json');



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const sendFirebaseNotification = async (registrationToken, payload) => {
    try {
        // V1 API 사용
        const response = await admin.messaging().send({
            token: registrationToken,
            notification: {
                title: payload.notification.title,
                body: payload.notification.body,
            },
        });
        console.log('Notification sent successfully:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { sendFirebaseNotification };



