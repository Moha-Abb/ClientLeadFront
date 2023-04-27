document.addEventListener('DOMContentLoaded', function () {


    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    const id = urlParams.get('id');

    const db = firebase.firestore();
    const rol = localStorage.getItem("rol")

    const form = document.getElementById('form')
    const inputMessage = document.getElementById('inputMessage')
    const chat = document.getElementById('chat')
    const chatContainer = document.getElementById('chatContainer')

    let projectChat= 'chat'+ id

    form.addEventListener('submit', (e) => {

        e.preventDefault()

        addMessage()
    })

    updateMessages()

async function addMessage() {

    try {

        await  db.collection(projectChat).add({

            message: inputMessage.value,
            idusuario: rol,
            fecha: Date.now()
        })
       

        updateMessages();
    } catch (e) {
        console.log(e)
    }
}
async function updateMessages() {
    console.log('hey')

    try {

        db.collection(projectChat).orderBy('fecha').onSnapshot((querySnapshot) => {
            chat.innerHTML = '';
            querySnapshot.forEach((doc) => {
                console.log(doc.data())

            if (doc.data().idusuario == 'client') {
                    chat.innerHTML += `
                    <li class="flex justify-start">
                    <div class="relative max-w-xl px-4 py-2 text-gray-800 bg-blue-300 rounded shadow">
                        <span class="block text-xl">${doc.data().message}</span>
                    </div>
                </li> 
                 `
                console.log(doc.data().message)
            } else {
                  chat.innerHTML += `
                  <li class="flex justify-end">
                  <div class="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                      <span class="block text-xl">${doc.data().message}</span>
                  </div>
              </li> `
                console.log(doc.data().message)

            }
        })
    })
    chatContainer.scrollTop = chatContainer.scrollHeight;
    inputMessage.value=''
    } catch (e) {
        console.log(e)
    }
}

})