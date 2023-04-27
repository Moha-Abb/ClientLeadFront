let path = window.location.pathname;

const header = document.getElementById('header');
let text;
async function headerr(){

    const response = await fetch('../components/header.html')

     text = await response.text();
    
     switch (path) {
        case '/developer/index.html':

          header.innerHTML=text;
          document.getElementById('endpointClient').classList.add('hidden');
          document.getElementById('endpointComun').classList.add('hidden');

          break;
          case '/client/index.html':
            header.innerHTML=text;
            document.getElementById('endpointDeveloper').classList.add('hidden');
            document.getElementById('endpointComun').classList.add('hidden');

          break;
        case '/comun/index.html':
            header.innerHTML=text;
            document.getElementById('endpointClient').classList.add('hidden');
            document.getElementById('endpointDeveloper').classList.add('hidden');



          break;
        default:

          window.location.href='/page404.html'
      }
}
headerr();
