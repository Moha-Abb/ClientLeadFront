function checkToken() {
    if (isTokenValid()) {
        const rol = localStorage.getItem("rol")
        if (rol == 'client') {
            document.getElementById('btnClientHref').classList.remove('hidden')
        }else{
            document.getElementById('btnDeveloperHref').classList.remove('hidden')
        }
    } else{
        
        document.getElementById('btnAccess').classList.add('hidden')

    }
}
checkToken()
let texto = ["Desarrollador", "Cliente.."]
let borrando = false;
let indice = 0;
let i = 0;


function escribir() {
    if (i == texto.length) {
        i = 0;
    }
    if (borrando) {

        indice--;
        document.getElementById("dinamicUser").innerHTML = texto[i].slice(0, indice);
        if (indice == 0) {
            borrando = false;
            i++
        }
    } else {

        document.getElementById("dinamicUser").innerHTML = texto[i].slice(0, indice);
        indice++;
        if (indice > texto[i].length) {
            texto[i]
            borrando = true;
        }
    }
}

setInterval(escribir, 200);