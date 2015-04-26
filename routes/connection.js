var express = require('express');
var router = express.Router();

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

/* GET connection page. */
router.get('/', function(req, res) {
    var hostname = req.app.get('hostname');
    if (req.query.session == 'disconnect') {
        req.session.destroy();
        res.redirect('/');
    }
    else {
        res.render('connection', {hostname: hostname});
    }
});

/* POST connection page (submit). */
router.post('/', function(req, res) {
    var hostname = req.app.get('hostname'),
        ip = req.connection.remoteAddress,
        user = req.body.user,
        password = req.body.password,
        warning = req.body.warning;

    var userStatus = checkUser(user, password, req);

    if (userStatus == "newconnect") {
        req.session.connected = true;
        req.session.user = user;
        req.session.warningMessage = "You are successfully connected !";
        req.session.warningType = 'success';
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

    if (req.session.connected == true) {
        res.redirect('control');
    }
    else {
        res.render('connection', {
            hostname: hostname,
            connectionWarning: userStatus,
            user: user
        });
    }
});

module.exports = router;
