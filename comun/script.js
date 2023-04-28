const rol = localStorage.getItem("rol")
const token = localStorage.getItem('token')
const user = localStorage.getItem('usuario')
const userId = localStorage.getItem('id')

checkToken();
async function checkToken() {
    if (!(await isTokenValid())) {
        window.location.href = "/login/logIn.html"
    }
}


const url = window.location.search;
const urlParams = new URLSearchParams(url);
const id = urlParams.get('id');
let idFound = false;

const allTasksData = document.getElementById('allTasks');
const taskInput = document.getElementById('taskInput');
const btnAddTask = document.getElementById('btnAddTask');
const loaderAddTask = document.getElementById('loaderAddTask');
const principalContent = document.getElementById('principalContent');
const principalLoader = document.getElementById('principalLoader');


if (id) {

    getProject()
} else {
    if (rol == 'client') {
        window.location.href = "/client/index.html"
    } else {
        window.location.href = '/developer/index.html'
    }
}

async function getProject() {

    try {
        let requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token
            },
            redirect: 'follow'
        };

        const response = await fetch("https://finalprojectfront.onrender.com/api/proyectos/" + id + "?populate=*", requestOptions);
        if (!response.ok) {

            window.location.href = '/page404.html'
        }

        principalLoader.classList.add('hidden')
        principalContent.classList.remove('hidden')
        principalContent.classList.remove('lg:hidden')

        const data = await response.json();

        // he metido esto aqui dentro porque sino no le da tiempo al script de header a cargarse
        const creators = data.data.attributes.users.data
        if (creators.length == 2) {
            document.getElementById('user').innerHTML = ` ${creators[0].attributes.username} ` + '&nbsp y &nbsp' + `${creators[1].attributes.username}`;
        } else {
            document.getElementById('user').innerHTML = user;
        }

        showTasks(data.data.attributes.tasks.data)


    } catch (e) {
        console.log(e)
    }

}

function showTasks(tasks) {

    allTasksData.innerHTML = '';
    let classDone = '';
    let hiddenBtn = '';
    for (let task of tasks) {

        if (task.attributes.isFinish) {
            classDone = 'line-through text-green';
            hiddenBtn = 'hidden'
        } else {
            classDone = 'text-grey-darkest';
            hiddenBtn = '';
        }
        allTasksData.innerHTML += `
    <div class="flex mb-2 mt-2 items-center">
                        <p id="taskContent${task.id}" class="w-full text-grey-darkest ${classDone}">${task.attributes.content}</p>
                        <button id="taskBtnDone${task.id}" onclick="updateTask(${task.id})"
                            class="${hiddenBtn} flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green
                             border-green hover:bg-green">Hecho</button>
                        <button onclick="deleteTask(${task.id})" id="btnDeleteTask${task.id}"
                            class="flex-no-shrink  p-2 ml-2 border-2 rounded text-red border-red
                             hover:text-white hover:bg-red">Eliminar</button>
                    
                    <div class="three-body hidden" id="loaderDeleteTask${task.id}">
                    <div class="three-body__dot"></div>
                    <div class="three-body__dot"></div>
                    <div class="three-body__dot"></div>
                    </div>
                    </div>
                    <hr>
    `
    }
}


async function createTask() {


    if (taskInput.value == '') {

        return
    }
    btnAddTask.classList.add('hidden')
    loaderAddTask.classList.remove('hidden')
    try {
        let raw = JSON.stringify({
            "data": {
                "content": taskInput.value,
                "isFinish": false,
                "creator": userId,
                "project": id
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
        const response = await fetch("https://finalprojectfront.onrender.com/api/tasks", requestOptions);

        if (!response.ok) {
            throw new Error('hay error en la peticion')
        }
        taskInput.value = '';
        btnAddTask.classList.remove('hidden')
        loaderAddTask.classList.add('hidden')
        getProject()

    } catch (e) {
        console.log(e)
    }
}

async function updateTask(id) {

    try {

        let raw = JSON.stringify({
            "data": {
                "isFinish": true,
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

        const response = await fetch("https://finalprojectfront.onrender.com/api/tasks/" + id, requestOptions)
        if (!response.ok) {

            throw new Error('hay error en la peticion')
        }

        document.getElementById('taskContent' + id).classList.add('line-through', 'text-green')
        document.getElementById('taskBtnDone' + id).classList.add('hidden')
    } catch (e) {
        console.log(e)
    }
}
async function deleteTask(id) {


    let btnDeleteTask = 'btnDeleteTask' + id
    let loaderDeleteTask = 'loaderDeleteTask' + id


    document.getElementById(btnDeleteTask).classList.add('hidden')
    document.getElementById(loaderDeleteTask).classList.remove('hidden')
    try {
        let requestOptions = {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + token
            },
            redirect: 'follow'
        };

        const response = await fetch("https://finalprojectfront.onrender.com/api/tasks/" + id, requestOptions)
        if (!response.ok) {

            throw new Error('hay error en la peticion')
        }

        document.getElementById(btnDeleteTask).classList.remove('hidden')
        document.getElementById(loaderDeleteTask).classList.add('hidden')
        getProject()

    } catch (e) {
        console.log(e)
    }
}
