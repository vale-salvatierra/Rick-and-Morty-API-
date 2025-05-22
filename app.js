let contenedorCards = document.querySelector('#contenedorCards')
let genderSelect = document.querySelector('#genderSelect')
let speciesSelect = document.querySelector('#speciesSelect')
let statusSelect = document.querySelector('#statusSelect')
let modalBody = document.querySelector('.modal-list')
let personajes = []
let url = 'https://rickandmortyapi.com/api/character'
isLoading = false;
let totalChar = 0


const obtenerPersonajes = () => {
    if (isLoading) return;
    isLoading = true;
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            personajes = []
            totalChar = data.info.count
            let totalPages = data.info.pages
            let promisesArr = []
            for (let i = 1; i <= totalPages; i++) {
                let fetches = fetch(`${url}/?page=${i}`)
                    .then(response => response.json())
                promisesArr.push(fetches)
            }
        return Promise.all(promisesArr)
                .then(paginas => {
                    paginas.forEach(pagina => {
                        const detalles = pagina.results.map((perfil) => ({
                            id: perfil.id,
                            img: perfil.image,
                            name: perfil.name,
                            status: perfil.status,
                            gender: perfil.gender,
                            species: perfil.species,
                            episodes: perfil.episode

                        }))
                        personajes = personajes.concat(detalles) 
                    })
                    
                    contenedorCards.innerHTML= ''
                    personajes.forEach(perfil => {
                        contenedorCards.innerHTML += crearCard(perfil)
                    })

                    

                })
                
        })
        .catch((error) => {
            console.log('Hubo un Error', error)
        })
        .finally(() => {
            isLoading = false;
        });
        

}



const crearCard = (char) => {
    return `
    <div class="col-md-3 ">
        <div class="card mt-5">
            <img  src="${char.img}" class="card-img-top" alt="${char.name}" />
            <div class="card-body">
                <h5 class="fs-2 card-title">${char.name}</h5>
                <p class="fs-4 card-text">Status: ${char.status}</p>
                <p class=" fs-4 card-text">Gender: ${char.gender}</p>
                <p class=" fs-4 card-text">Species: ${char.species}</p>
                <div class="text-center">
    <button type="button" class=" text-center btn btn-light fs-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="modalApp(${char.id})">
        Episodes
        </button>
</div>
            </div>
        </div>
    </div>
    `;

}

const modalApp = (id) => {
    const personaje = personajes.find(element => element.id === id);
    modalBody.innerHTML = ''; 

    personaje.episodes.forEach((epURL) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = epURL; // Despues tal vez estaria cool que solo apareciera el nombre o numero d epeisodio.
        modalBody.appendChild(li);
    });
};

obtenerPersonajes()

const filtrarChars = () => {
    let gender = genderSelect.value.toLowerCase()
    let status = statusSelect.value.toLowerCase()
    let species = speciesSelect.value.toLowerCase()

    let results = personajes.filter(element => {
        let genderMatch = gender == '' || element.gender.toLowerCase() === gender;
        let statusMatch = status == '' || element.status.toLowerCase() === status;
        let speciesMatch = species == '' || element.species.toLowerCase() === species;
        return genderMatch && speciesMatch && statusMatch
    })

    contenedorCards.innerHTML = '';
    results.forEach(result => {
        contenedorCards.innerHTML += crearCard(result)
    })
}

filtrarChars()

genderSelect.addEventListener('change', filtrarChars)

speciesSelect.addEventListener('change', filtrarChars)

statusSelect.addEventListener('change', filtrarChars)