var express = require('express');
var router = express.Router();
var exec = require("child_process").exec;
var fs = require('fs');

function my_exec(command, callback) {
    var proc = exec(command);

    var list = [];
    proc.stdout.setEncoding('utf8');

    proc.stdout.on('data', function (chunk) {
        list.push(chunk);
    });

    proc.stdout.on('end', function () {
        callback(list.join());
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var today=new Date();
    var h=today.getHours();
    var m=today.getMinutes();
    var s=today.getSeconds();
    var hostname=fs.readFile('/etc/hostname', 'utf8', function (err,data) { hostname=data; });
    var space=my_exec('df -h', function (stdout) {
        space=stdout;
    });
    var nbUsers=my_exec('uptime | rev | cut -d \',\' -f 7 | rev', function (stdout) {
        nbUsers=stdout;
    });
    var devices=my_exec('lsblk', function (stdout) {
        devices=stdout;
    });
    var interfaces=my_exec('ifconfig', function (stdout) {
        interfaces=stdout;
    });
    var ports=my_exec('ss -ant', function (stdout) {
        ports=stdout;
    });
    my_exec('./scripts/index', function (stdout) {
        setTimeout(function() {
            res.render('index', { h: h,m: m,s: s, hostname: hostname, space: space, nbUsers: nbUsers, ports: ports, interfaces: interfaces, devices: devices });
        }, 200);
    });
});

module.exports = router;
