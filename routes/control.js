var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;

function checkUser(user, password, req) {
    if (req.session.connected == true) {
        return "connected";
    }
    else if (!user && !password) {
        return "nothing";
    }
    else if (!user) { 
        return "nouser";
    }
    else if (!password) {
        return "nopass";
    }
    else {
        return "newconnect";
    }
}

/* GET control page. */
router.get('/', function(req, res) {
    var hostname = req.app.get('hostname');
    if (req.query.session == 'disconnect') {
        req.session.destroy();
    }
    else if (req.session.connected == true) {
        var userStatus = 'connected';
        var user = req.session.user;
    }
    res.render('control', {hostname: hostname, userStatus: userStatus, user: user});
});

/* POST control page (submit). */
router.post('/', function(req, res) {
    var hostname = req.app.get('hostname'),
        ip = req.connection.remoteAddress,
        cmd = req.body.cmd,
        user = req.body.user,
        password = req.body.password,
        userStatus = checkUser(user, password, req),
        warning;

    if (userStatus == "newconnect") {
        req.session.connected = true;
        req.session.user = user;
        warning = 'justconnected';
        userStatus = 'connected';
        console.log('New user from \x1b[42m' +ip+ '\x1b[0m successfully connected as : \x1b[32m' +user+ '\x1b[0m.');
    }
    else if (userStatus == "nothing") {
        console.log("User on \x1b[41m" +ip+ "\x1b[0m trying to connect without password and username.");
    }
    else if (userStatus == "nouser") {
        console.log("User on \x1b[41m" +ip+ "\x1b[0m trying to connect without username.");
    }
    else if (userStatus == "nopass") {
        console.log("User on \x1b[41m" +ip+ "\x1b[0m trying to connect as \x1b[31m" +user+ "\x1b[0m without password.");
    }
    else if (userStatus == "connected") {
        if (typeof req.body.user === 'undefined') {
            user = req.session.user;
        }
    }

    res.render('control', {
        hostname: hostname,
        userStatus: userStatus,
        warning: warning,
        cmd: cmd,
        user: user
    });
});

module.exports = router;
