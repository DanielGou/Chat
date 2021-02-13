const room = window.location.pathname.replace(/\//g,'')
const socket = io(`http://localhost:3000/${room}`)

let user = null

socket.on('update_messages', (messages)=>{
    updateMessagesOnScreen(messages)
})

function updateMessagesOnScreen(messages){
    const div_message = document.getElementById('message')

    let list_messages = '<ul>'
    messages.forEach(message=>{
        list_messages += `<li id='me'>${message.user}: ${message.msg}</li>`
    })

    list_messages += '</ul>'

    div_message.innerHTML = list_messages
}

document.addEventListener('DOMContentLoaded',()=>{
    const form = document.querySelector('#message_form')
    
    form.addEventListener('submit', (e)=>{
        e.preventDefault()

        if(!user){
            alert('Set the user to send message')
            return
        }

        const message = document.forms['message_form_name']['msg'].value
        document.forms['message_form_name']['msg'].value=''
        socket.emit('new_message', {user:user, msg:message})
    })

    user = localStorage.getItem('username')
})
