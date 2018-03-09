let numUsers = 0
const allUsers = {}
const SocketioData = {
    numUsers,
    allUsers
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

        socket.on('add user', (username) => {
            if (addedUser) return

            // we store the username in the socket session for this client
            socket.username = username
            SocketioData.numUsers++
                SocketioData.allUsers[username] = username
            addedUser = true
            console.log('server all ', allUsers)
            socket.emit('login', {
                numUsers: SocketioData.numUsers
            })

            // echo globally (all clients) that a person has connected
            socket.broadcast.emit('user joined', {
                username: socket.username,
                numUsers: SocketioData.numUsers,
                allUsers: SocketioData.allUsers
            })

        })

        socket.on('create room1', (username) => {
            socket.username = username
            socket.room = 'room1'
            socket.join('room1')
            socket.broadcast.to('room1', 'join room1')
        })

        socket.on('room chat', (data) => {
            io.sockets.in(socket.room).emit('new room chat', {
                username: socket.username,
                message: data
            })
        })

        socket.on('create room2', (username) => {
            socket.username = username
            socket.room = 'room2'
            socket.join('room2')
            socket.broadcast.to('room2', 'join room2')
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
                --SocketioData.numUsers
                delete SocketioData.allUsers[socket.username]
                console.log(allUsers)
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