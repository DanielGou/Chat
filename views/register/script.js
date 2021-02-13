const form = document.getElementById('reg-form')
form.addEventListener('submit', registerUser)

async function registerUser(event){
    event.preventDefault()

    const  username= document.getElementById('username').value
    const pass1 = document.getElementById('password1').value
    const pass2 = document.getElementById('password2').value

    let password = ''
    if(pass1 === pass2){
        password = pass1
    }else{
        alert('Passwords incorrect.')
        return
    }

    const result = await fetch('/api/register', {
        method: "POST",
        headers:{
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            username, 
            password
        })
    }).then(res => res.json())

    if(result.status === 'ok'){
        window.location.replace('/')
    }else{
        alert(result.error)
    }
}