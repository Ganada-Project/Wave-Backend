const mysql = require('mysql');
const config = require('../../../../config');
const conn = mysql.createConnection(config);

// const FCM = require('fcm-node');
// const serverKey = 'AAAAyS0H1u0:APA91bFX9VjAXOe6hGbGu7CvRQg_qRZzFdOjwY_qper2qVxpiY6P-LEb5KLk_Rh96r0N9iD_NVm6yAwxzIqUZ702_wDQ2RZiNzBS9XdD3Ckf1L_bPxXHERiFmeT58g4REHGPZmT0If8G'; //put your server key here
// const fcm = new FCM(serverKey);
// const crypto = require('crypto');
// const https = require("https");

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





