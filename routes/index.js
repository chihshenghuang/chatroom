let express = require('express');
let router = express.Router();
let io = require('../src/socketio');

let userTable = new Map();

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
		console.log('/login')
		let username = req.body.username;
		console.log(username)
		if(userTable.get(username) !== undefined){
			console.log('username is used!')
			res.status(400).send({ message: 'The username is already used!'});
		}
		else{
			userTable.set(username, 1)
			res.send(true);
		}
});

router.post('/logout', (req, res, next) => {
    let username = req.body.username;
    console.log(username)
    userTable.delete(username)
    res.send(true);
})

module.exports = router;
