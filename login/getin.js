function checkToken() {
    if (isTokenValid()) {

        const rol = localStorage.getItem("rol")
        if (rol == 'developer') {
            window.location.href = "/developer/index.html"
        } else {
            window.location.href = "/client/index.html"
        }
    }
}
checkToken();
const form = document.getElementById('form');
const contentLogin = document.getElementById('contentLogin');
const loader = document.getElementById('loader');
const body = document.getElementById('bodyContent');


form.addEventListener("submit", (e) => {
    e.preventDefault()

    contentLogin.classList.add('hidden')
    body.classList.add('loaderCenter')
    loader.classList.remove('hidden')
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData);

    showData(queryString.toString());

})

async function showData(data) {
    try {
        url = 'https://finalprojectfront.onrender.com/api/auth/local';
        let opciones = {
            method: 'POST',
            body: data,
            myHeaders: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }
        const response = await fetch(url, opciones);
        if (!response.ok) {
            if (response.status == 400 || response.status == 401) {

                contentLogin.classList.remove('hidden')
                body.classList.remove('loaderCenter')
                loader.classList.add('hidden')
                document.getElementById('alert').classList.remove('hidden')
                setTimeout(function () {
                    document.getElementById('alert').classList.add('hidden');
                }, 1700);
                return;
            }
            throw new Error('hay error en la peticion')
        }

        console.log(response)
        const result = await response.json();

        localStorage.setItem('token', result.jwt);
        localStorage.setItem('usuario', result.user.username);
        localStorage.setItem('rol', result.user.rol);
        localStorage.setItem('id', result.user.id);



        if (result.user.rol == 'developer') {
            window.location.href = '/developer/index.html'

        } else {
            window.location.href = '/client/index.html'

        }

    } catch (e) {
        console.log(e)
    }

}

