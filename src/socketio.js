let SocketioData = {
    room1: {
			numUsers: 0,
			allUsers: {}
		},
    room2: {
			numUsers: 0,
			allUsers: {}
		},
    room3: {
			numUsers: 0,
			allUsers: {}
		},
		room4: {
			numUsers: 0,
			allUsers: {}
		},
    room5: {
			numUsers: 0,
			allUsers: {}
		},
    room6: {
			numUsers: 0,
			allUsers: {}
		},
    room7: {
			numUsers: 0,
			allUsers: {}
		},
    room8: {
			numUsers: 0,
			allUsers: {}
		},
    room9: {
			numUsers: 0,
			allUsers: {}
		}
}

function CreateSocketio(server) {
    const io = require('socket.io')(server)

    io.on('connection', (socket) => {
        // when the client emits 'new message', this listens and executes
        let addedUser = false
        // socket.on('new message', (data) => {
        //     // we tell the client to execute 'new message'
        //     socket.broadcast.emit('new message', {
        //         username: socket.username,
        //         message: data
        //     })
        // })

        socket.on('get chats', () => {
            socket.emit('get chats', SocketioData)
            socket.broadcast.emit('get chats', SocketioData)
            // socket.to(socket.room).emit('get chats', SocketioData)
            // socket.emit('get chats', SocketioData)
            // io.emit('get chats', SocketioData)
            // setTimeout(function(){
            //     socket.emit('get chats', SocketioData)
            // }, 3000)
            // setTimeout(function(){
                // socket.emit('get chats', SocketioData)
            // }, 3000);
        })

        socket.on('join room', (username, room) => {
            // joinRoom(username, room)
						console.log('socket id', socket.id)
            if (addedUser) return
            if (SocketioData[room] === undefined) {
                SocketioData[room] = {
                    numUsers: 1,
                    allUsers: {}
                }
                SocketioData[room].allUsers[username] = socket.id
            } else {
                ++SocketioData[room].numUsers
								SocketioData[room].allUsers = SocketioData[room].allUsers || {}
								SocketioData[room].allUsers[username] = socket.id
            }
            // we store the username in the socket session for this client
            socket.username = username
            socket.room = room
            addedUser = true
            socket.join(room)
            // socket.broadcast.to(socket.room, `new user joined ${room}`)
            console.log('server all ', SocketioData)
        })

        // socket.on('create room', (username) => {
        //     // let room = `${username}'s Room`
        //     // socket.username = username
        //     joinRoom(username, username)
        //     // socket.broadcast.to(room, `new user joined ${room}`)
        // })
        socket.on('room chat', (data) => {
            console.log('server new room chat: ', data)
						if(data.toWho === null){
            	io.sockets.in(socket.room).emit('room chat', {
                username: socket.username,
                message: data.message
            	})
						}
						else{
							socket.to(SocketioData[socket.room].allUsers[data.toWho]).emit('room chat', {
								username: socket.username,
								message: data.message,
								private: true
							})
							socket.emit('room chat', {
								username: socket.username,
								message: data.message,
								private: true
							})
						}
        })
        // socket.on('join room', (username, room) => {
        //     socket.username = username
        //     socket.room = room
        //     socket.join(room)
        //     // socket.broadcast.to(socket.room, `new user joined ${room}`)
        // })

        // socket.on('get username', () => {
        //         console.log('server get user: ', socket.username)
        //         socket.emit('send username', socket.username)
        //     })
        //     // when the client emits 'typing', we broadcast it to others
        // socket.on('typing', () => {
        //     socket.broadcast.emit('stop typing', {
        //         username: socket.username
        //     })
        // })

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
