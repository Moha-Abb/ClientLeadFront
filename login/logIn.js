function checkToken() {
    if (isTokenValid()) {

        const rol = localStorage.getItem("rol")
        if(rol=='developer'){
            window.location.href = "/developer/index.html"
        }else{
            window.location.href = "/client/index.html"
        }
    }
}
checkToken();
const form = document.getElementById('form');

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData);

    showData(queryString);

})

async function showData(data) {
    try {
        url = 'http://localhost:1337/api/auth/local';
        let opciones = {
            method: 'POST',
            body: data,
            myHeaders: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }
        const response = await fetch(url, opciones);
        if (!response.ok) {
            if (response.status == 400||response.status == 401) {

                document.getElementById('alert').classList.remove('hidden')
                return;
            }
            throw new Error('hay error en la peticion')
        }

        const result = await response.json();

        document.getElementById('alert').classList.add('hidden')
        localStorage.setItem('token', result.jwt);
        localStorage.setItem('usuario', result.user.username);
        localStorage.setItem('rol', result.user.rol);
        localStorage.setItem('id', result.user.id);



        if(result.user.rol=='developer'){
            window.location.href = '/developer/index.html'

        }else{
            window.location.href = '/client/index.html'

        }

    } catch (e) {
        console.log(e)
    }

}
