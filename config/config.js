require('dotenv').config({ path: './.env' });

// 데이터베이스 설정
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

// JWT 비밀 키 설정 추가
console.log('SESSION_SECRET:', process.env.SESSION_SECRET); // 로그로 확인

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
        sessionSecret: process.env.SESSION_SECRET // 추가
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
        sessionSecret: process.env.SESSION_SECRET // 추가
    }
};
