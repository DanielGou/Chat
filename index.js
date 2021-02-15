const express = require('express')
const app = express()
const socketIo = require('socket.io')

app.use(express.static(__dirname + '/views'));

app.use(require('./routes/router'))

const server = app.listen(3000, ()=>{
    var host = server.address().address
    var port = server.address().port
    console.log(`Server On Running on ${host} in port ${port}`)
})

const messages = {chat:[]}

const io = socketIo(server)

const chat = io.of('/chat').on('connection', (socket)=>{
    socket.emit('update_messages', messages.chat)

    socket.on('new_message',(data)=>{
        messages.chat.push(data)
        
        chat.emit('update_messages', messages.chat)
    })
})