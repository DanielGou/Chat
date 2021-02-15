const express = require('express')
const router = express.Router()
const path = require('path')
const bodyPareser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

router.use(bodyPareser.json())

router.get('/', express.static('views/login'))

router.post('/api/login', async (req,res)=>{

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

router.get('/register', (req,res)=>{
    res.sendFile("/register")
})

router.post('/api/register', async (req,res)=>{
    
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

router.use('/chat', express.static(path.join(__dirname, 'views/chat')))

module.exports = router