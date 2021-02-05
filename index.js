const express = require('express')
const socket = require('socket.io')
const path = require('path')
const fs = require('fs')

const app = express()

app.use(express.static(__dirname + '/views'));

app.get('/login', (req,res)=>{
    res.sendFile("/login")
})

app.get('/chat', (req,res)=>{
    res.sendFile("/chat")
})

app.listen(3000, ()=>{
    console.log('Server On Running')
})