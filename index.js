const express = require('express')
const socket = require('socket.io')
const ejs = require('ejs')
const fs = require('fs')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/views'));

app.get('/', (req,res)=>{
    res.render('login/')
})

app.listen(3000, ()=>{
    console.log('Server On Running')
})