const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
const s3 = new AWS.S3();
const FCM = require('fcm-node');
const serverKey = 'AAAAyS0H1u0:APA91bFX9VjAXOe6hGbGu7CvRQg_qRZzFdOjwY_qper2qVxpiY6P-LEb5KLk_Rh96r0N9iD_NVm6yAwxzIqUZ702_wDQ2RZiNzBS9XdD3Ckf1L_bPxXHERiFmeT58g4REHGPZmT0If8G'; //put your server key here
const fcm = new FCM(serverKey);
const crypto = require('crypto');
const https = require("https");

exports.sendVerificationSMS = (phone_num, verification_code) => {
    let credential = 'Basic ' + new Buffer(config.APPID + ':' + config.APIKEY).toString('base64');
    let data = {
        "sender": config.SENDER,
        "receivers": [`${phone_num}`],
        "content": `WAVE 인증번호는 [${verification_code}] 입니다.`
    }
    let body = JSON.stringify(data);

    let options = {
        host: 'api.bluehouselab.com',
        port: 443,
        path: '/smscenter/v1.0/sendsms',
        headers: {
            'Authorization': credential,
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(body)
        },
        method: 'POST'
    };
    let req = https.request(options, function (res) {
        let body = "";
        res.on('data', function (d) {
            body += d;
        });
        res.on('end', function (d) {
            if (res.statusCode == 200)
                console.log(JSON.parse(body));
            else
                console.log(body);
        });
    });
    req.write(body);
    req.end();
    req.on('error', function (e) {
        reject(e);
    });
}

exports.getStyleById = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Style WHERE id = ${id}`, (err, result) => {
            if (err) reject(err);
            else resolve(result[0])
        });
    });
}

exports.getAllStyles = () => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM Style`, (err, result) => {
            if (err) reject(err);
            else resolve(result)
        });
    });
}

exports.uploadImage = (base64) => {
    return new Promise((resolve, reject)=>{
        const d = new Date();
        d.setUTCHours(d.getUTCHours());
        const picKey = d.getFullYear() + '_'
            + d.getMonth() + '_'
            + d.getDate() + '_'
            + crypto.randomBytes(20).toString('hex') + '.jpg';
        const picUrl = `https://s3.ap-northeast-2.amazonaws.com/wave-bucket-seoul/${picKey}`;
        let buf = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        s3.putObject({
            Bucket: 'wave-bucket-seoul',
            Key: picKey,    
            Body: buf,
            ACL: 'public-read'
        }, function (err, response) {
            if (err) reject(err);
            else resolve(response);
        });
    })
}

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM User WHERE email = '${email}'`, (err, result) => {
            if (err) reject(err);
            else resolve(result[0])
        });
    });
}

exports.createUser = (email,password) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO User(email, password) VALUES(?,?)',
            [email, password],
            (err, result) => {
            if (err) reject(err);
            else resolve(result)
        });
    });
}

exports.createPersonal = (userId, sex, name, nickname, phone) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Personal(user_id, sex, name, nickname, phone) VALUES(?,?,?,?,?)',
            [userId, sex, name, nickname, phone],
            (err, result) => {
                if (err) reject(err);
                else resolve(result)
            });
    });
}

exports.createBody = (userId, height, weight, waist) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Body(user_id, height, weight, waist) VALUES(?,?,?,?)',
            [userId, height, weight, waist],
            (err, result) => {
                if (err) reject(err);
                else resolve(result)
            });
    });
}

exports.createStyle = (userId, styleId) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO UserStyle(user_id, style_id) VALUES(?,?)',
            [userId, styleId],
            (err, result) => {
                if (err) reject(err);
                else resolve(result)
            });
    });
}