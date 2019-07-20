var firebase = require('firebase')
var firebaseTools = require('firebase-tools')
var config = {
  apiKey: "AIzaSyBbwgvy9unundMYxJnOllPc9kKx2IJ7prY",
  authDomain: "pract-808d5.firebaseapp.com",
  databaseURL: "https://pract-808d5.firebaseio.com"
};

firebase.initializeApp(config);

var rootRef = firebase.database().ref();

var database = firebase.database();
database.ref("/yoo").set({
	name : "name"
})
database