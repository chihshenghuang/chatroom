let express = require('express');
let router = express.Router();
let io = require('../src/socketio');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

router.get('/chats', (req, res, next) => {
    //res.send('chat')
    let chats = io.SocketioData.numUsers
    res.send({ chatroom: chats });
});

router.post('/createroom', (req, res, next) => {
    let username = JSON.parse(req.body.roomName).username;
    console.log(req.body.roomName)
    let content = { username: username };
    res.render('privateRoom', { title: username });
});

router.post('/login', (req, res, next) => {
    res.send(true);
});

module.exports = router;