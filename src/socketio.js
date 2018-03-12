let SocketioData = {}

function CreateSocketio(server) {
    const io = require('socket.io')(server)
    const room1 = io.of('/room1')

    io.on('connection', (socket) => {
        // when the client emits 'new message', this listens and executes
        let addedUser = false
        socket.on('new message', (data) => {
            // we tell the client to execute 'new message'
            socket.broadcast.emit('new message', {
                username: socket.username,
                message: data
            })
        })

        socket.on('add user', (username, room) => {
            if (addedUser) return
            if (SocketioData[room] === undefined) {
                SocketioData[room] = {
                    numUsers: 1,
                    allUsers: [username]
                }
            } else {
                ++SocketioData[room].numUsers
                SocketioData[room].allUsers.push(username)
            }
            // we store the username in the socket session for this client
            socket.username = username
            socket.room = room
            addedUser = true
            console.log('server all ', SocketioData)

            /*
            socket.emit('login', {
                numUsers: SocketioData.numUsers
            })

            // echo globally (all clients) that a person has connected
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: SocketioData.numUsers,
                allUsers: SocketioData.allUsers
            })
            */
        })

        socket.on('create room', (username) => {
            let userRoom = `${username}'s Room`
            socket.username = username
            socket.room = userRoom
            socket.join(userRoom)
            socket.broadcast.to(userRoom, `new user joined ${userRoom}`)
        })

        socket.on('room chat', (data) => {
            console.log('server new room chat')
            io.sockets.in(socket.room).emit('new room chat', {
                username: socket.username,
                message: data
            })
        })

        socket.on('get username', () => {
                console.log('server get user: ', socket.username)
                socket.emit('send username', socket.username)
            })
            // when the client emits 'typing', we broadcast it to others
        socket.on('typing', () => {
            socket.broadcast.emit('stop typing', {
                username: socket.username
            })
        })

        // when the user disconnects.. perform this
        socket.on('disconnect', () => {
            if (addedUser) {
                --SocketioData[socket.room].numUsers
                delete SocketioData[socket.room].allUsers[socket.username]
                console.log('disconnect', SocketioData)
                    //echo globally that this client has left
                socket.broadcast.emit('user left', {
                    username: socket.username,
                    numUsers: SocketioData.numUsers,
                    allUsers: SocketioData.allUsers
                })
            }
        })
    })
}

module.exports = {
    CreateSocketio,
    SocketioData
}