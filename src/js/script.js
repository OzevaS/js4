import 'normalize.css';
import '../scss/style.scss';

let search = document.getElementById('search');
let inputSearch = search.querySelector('input');
let autocompleteSearch = search.querySelector('ul');

let savedRepositories = document.getElementById('repositories');

let repsArr = [];

let showRepositoriesDebounce = debounce(showRepositories, 1000);

inputSearch.addEventListener('input', showRepositoriesDebounce);

document.addEventListener('click', saveRepository);

document.addEventListener('click', removeRepository);

function removeRepository(event) {
    let button = event.target;
    if (!button.classList.contains('repositories__btn-close-item'))
        return;

    let rep = button.closest('li');
    rep.remove();
}

function saveRepository(event) {
    let target = event.target;
    if (!target.classList.contains('search__item'))
        return;

    for (let foundRep of autocompleteSearch.querySelectorAll('li'))
        foundRep.remove();
    inputSearch.value = '';

    let rep = repsArr[target.dataset.index];

    let cardRep = document.createElement('li');
    cardRep.classList.add('repositories__item');

    cardRep.innerHTML = `
        <p>Name: ${rep.name}</p>
        <p>Owner: ${rep.owner.login}</p>
        <p>Stars: ${rep.stargazers_count}</p>`;

    let closeButton = document.createElement('button');
    closeButton.classList.add('repositories__btn-close-item');

    cardRep.append(closeButton);

    savedRepositories.append(cardRep);
}

async function showRepositories() {
    try {
        for (let foundRep of autocompleteSearch.querySelectorAll('li'))
            foundRep.remove();

        if (!inputSearch.value)
            return;

        let repsPromise = await getRepositories(inputSearch.value);
        repsArr = repsPromise.items;

        let cardRep;
        for (let i = 0; i < repsArr.length && i < 5; i++) {
            cardRep = document.createElement('li');
            cardRep.classList.add('search__item');
            cardRep.textContent = repsArr[i].name;
            cardRep.setAttribute('data-index', i);
            autocompleteSearch.append(cardRep);
        }

    }
    catch (e) {
        console.log(e);
    }
}

async function getRepositories(target) {
    let url = new URL('https://api.github.com/search/repositories');
    url.searchParams.set('q', target);

    let response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
    else {
        throw new Error("Ошибка HTTP: " + response.status);
    }
}

function debounce (fn, debounceTime) {
    let currentTimeout = null;
    return function wrapper() {
        clearTimeout(currentTimeout);
        
        currentTimeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, debounceTime)
    }
};