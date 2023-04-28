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
const url = window.location.search;
const urlParams = new URLSearchParams(url);
let user = urlParams.get('u');

const contentLogin = document.getElementById('contentLogin');
const loader = document.getElementById('loader');
const body = document.getElementById('bodyContent');

const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    contentLogin.classList.add('hidden')
    body.classList.add('loaderCenter')
    loader.classList.remove('hidden')

    const formData = new FormData(form)
    const queryString = new URLSearchParams(formData)

    queryString.append("rol", user);
    queryString.append("username", formData.get('name'));

    showData(queryString.toString())
})

async function showData(data) {

    try {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
        };

        const response = await fetch("https://finalprojectfront.onrender.com/api/auth/local/register", requestOptions)

        if (!response.ok) {

            if (response.status == 400 || response.status == 401) {

                document.getElementById('alert').classList.remove('hidden')
                contentLogin.classList.remove('hidden')
                body.classList.remove('loaderCenter')
                loader.classList.add('hidden')
                setTimeout(function () {
                    document.getElementById('alert').classList.add('hidden');
                }, 1500);
                return;
            }
            throw new Error('hay error en la peticion')
        }
        document.getElementById('alert').classList.add('hidden')

        if (response.status == 200) {
            window.location.href = '/login/logIn.html';

        }
    } catch (e) {
        console.log(e);
    }
}
