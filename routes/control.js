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
        req.session.connected = true;
        return "newconnect";
    }
}

/* GET control page. */
router.get('/', function(req, res) {
    res.render('control');
});

/* POST control page (submit). */
router.post('/', function(req, res) {
    var ip = req.connection.remoteAddress,
        cmd = req.body.cmd,
        user = req.body.user,
        password = req.body.password;
    var userStatus = checkUser(user, password, req);
    if (userStatus == "nothing") {
        console.log("User on \x1b[31m" +ip+ "\x1b[0m trying to connect without password and username.");
    }
    else if (userStatus == "nouser") {
        console.log("User on \x1b[31m" +ip+ "\x1b[0m trying to connect without username.");
    }
    else if (userStatus == "nopass") {
        console.log(user+ " on \x1b[31m" +ip+ "\x1b[0m trying to connect without password.");
    }
    res.render('control', {
        userStatus: userStatus,
        cmd: cmd,
        user: user,
        password: password
    });
});

module.exports = router;
