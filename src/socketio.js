let SocketioData = {
    room4: {},
    room5: {},
    room6: {},
    room7: {},
    room8: {}
}

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
                    allUsers: {}
                }
                SocketioData[room].allUsers[username] = 'Member'
            } else {
                ++SocketioData[room].numUsers
                SocketioData[room].allUsers[username] = 'Member'
            }
            // we store the username in the socket session for this client
            socket.username = username
            socket.room = room
            addedUser = true
            socket.join(room)
            socket.broadcast.to(socket.room, `new user joined ${room}`)
            console.log('server all ', SocketioData)
        })

        socket.on('create room', (username) => {
            let room = `${username}'s Room`
            socket.username = username
            socket.room = room
            socket.join(room)
            socket.broadcast.to(room, `new user joined ${room}`)
        })
        socket.on('room chat', (data) => {
            console.log('server new room chat: ', socket.room)
            console.log('server new room chat: ', data)

            io.sockets.in(socket.room).emit('new room chat', {
                username: socket.username,
                message: data
            })
        })
        socket.on('join room', (username, room) => {
            socket.username = username
            socket.room = room
            socket.join(room)
            socket.broadcast.to(socket.room, `new user joined ${room}`)
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
                    numUsers: SocketioData[socket.room].numUsers,
                    allUsers: SocketioData[socket.room].allUsers
                })
            }
        })
    })
}

module.exports = {
    CreateSocketio,
    SocketioData
}