$(function() {
    if ($('#Login')) {
        // Initialize variables
        let $window = $(window)
        let $usernameInput = $('.usernameInput')
        let $loginPage = $('.login.page')
        let username = null
        let room = null
        let $currentInput = $usernameInput.focus()
        let socket = io()

        // Sets the client's username
        function setUsername() {
            username = $usernameInput.val()
            $usernameInput.val('') //cleanInput($usernameInput.val().trim())

            // If the username is valid
            if (username) {
                $loginPage.fadeOut()
                $loginPage.off('click')
            }
        }

        // Keyboard events
        $window.keydown(function(event) {
            // Auto-focus the current input when a key is typed
            if (!(event.ctrlKey || event.metaKey || event.altKey)) {
                $currentInput.focus();
            }
            // When the client hits ENTER on their keyboard
            if (event.which === 13) {
                setUsername();
            }
        });

        $('#create').click((evt) => {
            $('input[name="roomName"]').val(JSON.stringify({ username }))
            $('#createroomForm').submit()
            socket.emit('create room', username)
            evt.stopPropagation()
            evt.preventDefault()
        })

        $('#room1').click((evt) => {
            $('input[name="roomName"]').val(JSON.stringify({ username }))
            $('#room1Form').submit()
            room = 'room1'
            evt.stopPropagation()
            evt.preventDefault()
            socket.emit('add user', username, room)
        })

        $('#room2').click((evt) => {
            $('input[name="roomName"]').val(JSON.stringify({ username }))
            $('#room2Form').submit()
            room = 'room2'
            evt.stopPropagation()
            evt.preventDefault()
            socket.emit('add user', username, room)
        })

        $('#room3').click((evt) => {
                room = 'room3'
                $('input[name="roomName"]').val(JSON.stringify({ username }))
                $('#room3Form').submit()
                evt.stopPropagation()
                evt.preventDefault()
                socket.emit('add user', username, room)
            })
            // Click events

        // Focus input when clicking anywhere on login page
        $loginPage.click(() => {
            $currentInput.focus()
        })

        /*      socket.on('disconnect', () => {
            log('You have been disconnected')
        })
*/
        socket.on('reconnect', () => {
            log('You have been reconnected')
            if (username) {
                socket.emit('add user', username, room)
            }
        })

        socket.on('reconnect_error', () => {
            log('attempt to reconnect has failed')
        })
    }
})