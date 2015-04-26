var express = require('express');
var router = express.Router();

/* GET control page. */
router.get('/', function(req, res) {
    var hostname = req.app.get('hostname');
    if (req.session.connected == true) {
        var userStatus = 'connected',
            user = req.session.user,
            warningMessage = req.session.warningMessage,
            warningType = req.session.warningType;

    delete req.session.warningMessage;
    delete req.session.warningType;
        res.render('control', {
            hostname: hostname,
            userStatus: userStatus,
            user: user,
            warningMessage: warningMessage,
            warningType: warningType
        });
    }
    else {
        res.redirect('connection');
    }
});

/* POST control page (submit). */
router.post('/', function(req, res) {
    var hostname = req.app.get('hostname'),
        cmd = req.body.cmd,
        user = req.session.user,
        warningMessage = req.session.warningMessage,
        warningType = req.session.warningType;

    delete req.session.warningMessage;
    delete req.session.warningType;
    if (req.session.connected == true) {
        var userStatus = 'connected';
        res.render('control', {
            hostname: hostname,
            userStatus: userStatus,
            cmd: cmd,
            user: user,
            warningMessage: warningMessage,
            warningType: warningType
        });
    }
    else {
        res.redirect('connection');
    }
});

module.exports = router;
