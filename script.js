const API_URL = 'https://api.github.com/users/'

const form = document.getElementById('form')
const main = document.getElementById('main')
const search = document.getElementById('search')

async function getUser(username) {
    try {
        const { data } = await axios(API_URL + username)

        createUserCard(data)
        getRepos(username)
    }
    catch(err) {
        if (err.response.status == 404) {
            createErrorCard(username)
        }
    } 
}

async function getRepos(username) {
    try {
        const { data } = await axios(API_URL + username + '/repos?sort=created')

        addReposToCard(data)       
    }
    catch(err) {
            createErrorCard('Problem fetching repos')
    } 
}

function createErrorCard(user) {
    const errorCard = `
    <div class="card" style="background-color: darkred;">
        <div>
            <img src="https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" alt="no-user" class="avatar">
        </div>
        <div class="user-info">
            <h2>Error 404</h2>
            <p style="font-weight: bold;"><span style="color: black; font-weight: bold;">${user}</span> doesn't exist on Github.</p>
        </div>
    </div>
    `
    main.innerHTML = errorCard
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')

    repos
        .slice(0, 10)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        })
}

function createUserCard(user) {

    if (user.bio === null) {
        user.bio = 'No Information'
    }

    if (user.name === null) {
        user.name = user.login
    }
    const cardHTML = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}" alt="" class="avatar">
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}.</p>

            <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>

            <div id="repos"></div>
        </div>
    </div>
    `
    
    main.innerHTML = cardHTML
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if (user) {
        getUser(user)

        search.value = ''
    }
})
