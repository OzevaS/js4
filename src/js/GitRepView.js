import { Search } from "./search";

export class GitRepView {
    constructor(where) {
        this._app = this.createElement('div', 'gitview');

        this._search = new Search(this._app);
        this._search.setup('https://api.github.com/search/repositories');
        this._search.debounceUpdate(1000);
        this._search.addCallbackForChoose((rep) => this.addRep(rep));

        this._listReps = this.createElement('ul', 'gitview__list-reps');
        this._app.append(this._listReps);
        where.append(this._app);
    }

    addRep(rep) {
        let cardRep = this.createElement('li', 'gitview__item');

        cardRep.innerHTML = `
            <p>Name: ${rep.name}</p>
            <p>Owner: ${rep.owner.login}</p>
            <p>Stars: ${rep.stargazers_count}</p>`;

        let closeButton = this.createElement('button', 'gitview__btn-close-item');
        closeButton.addEventListener('click', this.removeRep);

        cardRep.append(closeButton);

        this._listReps.append(cardRep);
    }

    removeRep(event) {
        let button = event.target;
        if (!button.classList.contains('gitview__btn-close-item'))
            return;

        let rep = button.closest('li');
        rep.remove();
    }

    createElement(tagName, className) {
        let element = document.createElement(tagName);
        if (className)
            element.classList.add(className);
        return element;
    }
}