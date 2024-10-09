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
    };

    try {
        const response = await admin.messaging().send(registrationToken, payload);
        console.log('Notification sent successfully:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};


module.exports = { sendFirebaseNotification };



