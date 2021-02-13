const express = require('express')
const app = express()
const socketIo = require('socket.io')
const path = require('path')
const bodyPareser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

app.use(express.static(__dirname + '/views'));
app.use(bodyPareser.json())

app.get('/', express.static('views/login'))

app.post('/api/login', async (req,res)=>{

    const { username, password } = req.body

    const user = await User.findOne({username}).lean()

    if(!user){
        return res.json({ status: 'error', error: 'Invalid username/password' })
    }

    if(await bcrypt.compare(password,user.password)){        
        return res.json({ status: 'ok'})
    }

    res.json({ status: 'error', error: 'Invalid username/password'})
})

app.get('/register', (req,res)=>{
    res.sendFile("/register")
})

app.post('/api/register', async (req,res)=>{
    
    const { username, password: plainTextPassword } = req.body

    if(!username || typeof username !== 'string'){
        return res.json({ status: 'error', error: 'Invalid username' })
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if(plainTextPassword < 5){
        return res.json({ status: 'error', error: 'Password too small. Should be atleast 6 characters' })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    try{
        const response = await User.create({
            username,
            password
        })
        console.log('User create successfully: ', response)
    }catch(err){
        
        if(err.code === 11000){
            return res.json({ status: 'error', error: "Username already in use" })
        }
        throw err
    }

    res.json({ status: 'ok' })
    
})

app.use('/chat', express.static(path.join(__dirname, 'views/chat')))

const server = app.listen(3000, ()=>{
    console.log('Server On Running')
})


const messages = {chat:[], chat1:[]}

const io = socketIo(server)

const chat = io.of('/chat').on('connection', (socket)=>{
    socket.emit('update_messages', messages.chat)

    socket.on('new_message',(data)=>{
        messages.chat.push(data)
        
        chat.emit('update_messages', messages.chat)
    })
})