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
    let room = `${username}'s Room`
    res.render('room', { username: username, room });
});

router.post('/joinroom/:room', (req, res, next) => {
    let username = JSON.parse(req.body.roomName).username;
    let room = req.params.room
    console.log(username)
    res.render('room', { username: username, room })
});

router.get('/getRoomData', (req, res, next) => {
    res.send(io.SocketioData)
});


router.post('/login', (req, res, next) => {
    res.send(true);
});

module.exports = router;