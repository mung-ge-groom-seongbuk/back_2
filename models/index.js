'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config(); // dotenv 로드
const basename = path.basename(__filename);
const db = {};

// Sequelize 인스턴스 생성 (환경 변수 사용)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: console.log, // 쿼리 로그 출력
  }
);

// 현재 디렉토리 내의 모든 모델 파일을 불러와서 db 객체에 추가
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 모델 간의 관계 설정 (Associations)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// sequelize 및 Sequelize를 db 객체에 추가
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

