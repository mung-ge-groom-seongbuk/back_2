require('dotenv').config({ path: './.env' }); // dotenv 패키지 로드
const express = require('express');
const db = require('./models'); // models/index.js에서 db 객체 가져오기

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 연결 및 테이블 동기화
db.sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return db.sequelize.sync(); // alter 옵션 없이 스키마 변경 적용
  })
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// 기본 라우트
app.get('/', (req, res) => res.send('Hello World!'));

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




