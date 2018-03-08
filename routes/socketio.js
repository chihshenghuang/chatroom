var express = require('express');
var router = express.Router();
var io = require('../src/socketio');

router.get('/', (req, res, next) => {
    console.log('socketio Data', io.SocketioData)
    res.send('socketio')
});

module.exports = router;