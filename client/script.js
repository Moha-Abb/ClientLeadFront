// import { createProject } from './client.js'
function checkToken() {
    if (isTokenValid()) {
        const rol = localStorage.getItem("rol")
        if (rol == 'developer') {
            window.location.href = "/developer/index.html"
        }
    } else {
        window.location.href = "/login/logIn.html"
    }
}
checkToken();

const token = localStorage.getItem('token')
const user = localStorage.getItem('usuario')
const form = document.getElementById('form');
const formProject = document.getElementById('formProject');

const updateBtn = document.getElementById('updateBtn');
const createBtn = document.getElementById('createBtn');

const inputProjectName = document.getElementById('nameProject');
const inputProjectPrice = document.getElementById('priceProject');
const inputProjectFinishDate = document.getElementById('finishDate');
const inputProjectClientEmail = document.getElementById('developerEmail');
const statusProjectForm = document.getElementById('statusProjectForm');
const radioStatusProject = document.getElementById('radioStatusProject');
const alertNewProject = document.getElementById('alertNewProject');
const principalLoader = document.getElementById('principalLoader');


let allProjects = [];
let idsProjects;
let idUpdate = null;


//del boton en html de crear nuevo proyecto lo que hace es mostrar formolario 
function newProject() {
    document.getElementById('principalContent').classList.add('hidden')
    updateBtn.classList.add('hidden')
    statusProjectForm.classList.add('hidden')
    document.getElementById('formProject').classList.remove('md:hidden')
}

// del boton en html de modificar lo que hace es pintar en los input informacion de dicho proyecto
function updateProjectInputs(id) {
    document.getElementById('principalContent').classList.add('hidden')
    createBtn.classList.add('hidden')
    document.getElementById('formProject').classList.remove('md:hidden')

    const project = allProjects.find(parameter => parameter.id == id)

    inputProjectName.value = project.name;
    inputProjectPrice.value = project.price;
    inputProjectFinishDate.value = project.finishdate;
    inputProjectClientEmail.value = project.userAsigned;
    inputProjectClientEmail.disabled = true;
    radioStatusProject.checked = true;

    idUpdate = id;
}


getProjects()
// llamada a todos los proyectos
async function getProjects() {

    document.getElementById('principalContent').classList.add('hidden')
    document.getElementById('principalLoader').classList.remove('hidden')

    try {

        let requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token
            },
            redirect: 'follow'
        };

        const response = await fetch("http://localhost:1337/api/users/me?populate=*", requestOptions)

        if (!response.ok) {


            throw new Error('hay error en la peticion')
        }
        document.getElementById('principalContent').classList.remove('hidden')
        document.getElementById('principalLoader').classList.add('hidden')

        const result = await response.json();

        // he metido esto aqui dentro porque sino no le da tiempo al script de header a cargarse
        document.getElementById('userClient').innerHTML = user;

        allProjects = result.projects;
        idsProjects = result.projects.map(proyecto => proyecto.id).join(',');

        showAllProjects(result.projects)

    } catch (e) {
        console.log(e)
    }
}

//pintar tanto los proyectos como ganancias
function showAllProjects(projectsArray) {

    const projects = document.getElementById('projects');
    const table = document.getElementById('table');
    projects.innerHTML = '';
    table.innerHTML = '';

    for (let project of projectsArray) {


        projects.innerHTML +=
            `<button
          class="flex items-center w-full lg:px-5 lg:py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 lg:border-b hover:bg-gray-100 focus:outline-none">

          <div class="text-left rtl:text-right">
          <h1 class="text-sm font-medium text-gray-700 capitalize dark:text-white">${project.name}</h1>

         <p class="text-xs text-gray-500 dark:text-gray-400">${project.status}</p>
        </div>
      </button>
    `
        table.innerHTML += ` <tr class="border-b">
   
    <td class="px-6   py-4 whitespace-no-wrap  border-gray-500">
        <div class=" text-sm leading-5 text-blue-900">${project.name}</div>
    </td>
    <td
        class=" px-6 py-4 whitespace-no-wrap  text-blue-900 border-gray-500  hidden xl:block">
        <div class="py-4 text-sm leading-5">${project.userAsigned}</div>
    </td>

    <td
        class="px-6 py-4 whitespace-no-wrap  text-blue-900 border-gray-500 text-sm leading-5 ">
        <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span aria-hidden class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
            <span class="relative text-xs">${project.status}</span>
        </span>
    </td>
    <td
        class=" px-6 py-4 whitespace-no-wrap  text-blue-900 border-gray-500 text-sm leading-5 hidden xl:block">
        <div class="py-4">${project.price}</div>
    </td>
    <td
        class="px-6 py-4 whitespace-no-wrap  border-gray-500 text-blue-900 text-sm leading-5">
        ${project.finishdate}</td>
    <td class="px-6 py-4 flex flex-col gap-1 md:flex-row whitespace-no-wrap text-right  border-gray-500 text-sm leading-5">
        <a href="/comun/index.html?id=${project.id}" 
            class="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Ver
            Detalles
        </a>
        <button onclick="updateProjectInputs(${project.id})"
            class="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">
            Modificar
        </button>
        <button onclick="deleteProject(${project.id})" 
            class="px-5 py-2 border-blue-500 border  rounded transition duration-300 bg-red-500 hover:bg-blue-700 text-white focus:outline-none">
            Eliminar
        </button>
    </td>
</tr>`
    }
}

// evento submit que llama a funcion crear proyecto
form.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    createProject(formObject);

})


async function createProject(object) {

    document.getElementById('formProjectContent').classList.add('hidden')
    document.getElementById('loaderAddProject').classList.remove('hidden')

    try {

        let raw = JSON.stringify({
            "data": {
                "name": object.name,
                "price": object.price,
                "status": 'en proceso',
                "finishdate": object.finishdate,
                "userAsigned": object.developerEmail

            }
        });
        let requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: raw,
            redirect: 'follow'
        };
        const response = await fetch("http://localhost:1337/api/proyectos", requestOptions);
        if (!response.ok) {
            if (response.status == 400 || response.status == 401) {
                document.getElementById('formProjectContent').classList.remove('hidden')
                document.getElementById('loaderAddProject').classList.add('hidden')
                document.getElementById('alertNewProject').classList.remove('hidden')

                setTimeout(function () {
                    document.getElementById('alertNewProject').classList.add('hidden');
                }, 4000);
                return;
            }
            throw new Error('hay error en la peticion')
        }
        window.location.reload();
    } catch (e) {
        console.log(e)
    }
}
async function updateProject() {

    document.getElementById('formProjectContent').classList.add('hidden')
    document.getElementById('loaderAddProject').classList.remove('hidden')

    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    try {

        let raw = JSON.stringify({
            "data": {
                "name": formObject.name,
                "price": formObject.price,
                "status": formObject.status,
                "finishdate": formObject.finishdate,
                "userAsigned": formObject.developerEmail

            }
        });
        let requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: raw,
            redirect: 'follow'
        };


        const response = await fetch("http://localhost:1337/api/proyectos/" + idUpdate, requestOptions);
        if (!response.ok) {
            if (response.status == 400 || response.status == 401) {
                document.getElementById('formProjectContent').classList.remove('hidden')
                document.getElementById('loaderAddProject').classList.add('hidden')

                return;
            }
            throw new Error('hay error en la peticion')
        }

        window.location.reload();
    } catch (e) {
        console.log(e)
    }

}
async function deleteProject(id) {

    try {

        const confirmation = confirm('Esta seguro que quiere eleminar?');
        const alert = document.getElementById('alert');


        let requestOptions = {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + token
            },
            redirect: 'follow'
        };

        if (confirmation) {


            const response = await fetch("http://localhost:1337/api/proyectos/" + id, requestOptions)
            console.log(response)
            if (!response.ok) {

                throw new Error('hay error en la peticion')
            }

            alert.classList.remove('hidden');
            setTimeout(function () {
                alert.classList.add('hidden');
            }, 2000);
            getProjects()
        }
    } catch (e) {
        console.log(e)
    }
}

