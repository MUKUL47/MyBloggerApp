
'use strict';
const {google} = require('googleapis');
const express = require('express');
const app = express();
const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
var request = require('request');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
var globalParams = "";
const JSON = require('circular-json');
require('dotenv').config()

const client = new google.auth.OAuth2(
    process.env.key1,
    process.env.key1,
    "http://localhost:3000/getAccessToken"
);

var authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

var login =  (req, res) => {
    exports.email = ""
    res.redirect(authorizeUrl);
}

var getAccessToken = (req, res) => {
    client.getToken(req.query.code, (err, token) => {
        client.setCredentials(token);
        request({
            headers: {
                'Authorization': 'Bearer '+token.access_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },uri : "https://www.googleapis.com/gmail/v1/users/me/profile", method: 'GET'},(error, response, body)=>{
            exports.email = JSON.parse(body).emailAddress
            if( globalParams == "register"){
                exports.exception = "register"
                res.redirect("/register")
            }else{
                exports.exception = "login"
                res.redirect("/login")
            }

        })
    });

};
exports.login = login;
exports.getAccessToken = getAccessToken;