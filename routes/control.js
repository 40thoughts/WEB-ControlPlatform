var express = require('express');
var router = express.Router();

/* GET control page. */
router.get('/', function(req, res) {
    var hostname = req.app.get('hostname');

    if (req.session.connected == true) {
        var userStatus = 'connected';
        var user = req.session.user;
        res.render('control', {hostname: hostname, userStatus: userStatus, user: user});
    }
    else {
        res.redirect('connection');
    }
});

/* POST control page (submit). */
router.post('/', function(req, res) {
    var hostname = req.app.get('hostname'),
        cmd = req.body.cmd,
        user = req.session.user;

    if (req.session.connected == true) {
        var userStatus = 'connected';
        res.render('control', {
            hostname: hostname,
            userStatus: userStatus,
            cmd: cmd,
            user: user
        });
    }
    else {
        res.redirect('connection');
    }
});

module.exports = router;
