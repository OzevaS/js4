export class Search {
    constructor(where) {
        this._app = this.createElement('div', 'search');
        this.update = this._update;

        this._input = this.createElement('input', 'search__input');
        this._input.type = 'text';
        this._input.addEventListener('input', () => this.update());

        this._autoCompleteList = this.createElement('ul', 'search__autocomplete');

        this._app.append(this._input);
        this._app.append(this._autoCompleteList);

        where.append(this._app);
    }

    setup(stringURL) {
        this._url = new URL(stringURL);
    }

    async _update() {
        try {
            if (this._input.value == '')
                return;

            await this.sendRequest(this._input.value);

            this.showFound();
        }
        catch(err) {
            console.log(err);
        }
    }

    async sendRequest(target) {
        if (!this._url)
            return null;

        this._url.searchParams.set('q', target);

        let response = await fetch(this._url);

        if (response.ok) {
            this._response = await response.json();
            return;
        }

        throw new Error("Ошибка HTTP: " + response.status);
    }

    showFound() {
        this.clear();

        let responseArr = this._response.items;

        for (let i = 0; i < responseArr.length && i < 5; i++) {
            let cardRep = this.createElement('li', 'search__item');
            cardRep.textContent = responseArr[i].name;
            cardRep.setAttribute('data-index', i);
            this._autoCompleteList.append(cardRep);
        }
    }

    addCallbackForChoose(cb) {
        if (this._cb)
            document.removeEventListener('click', this._cb);

        function wrapper(event) {
            let target = event.target;
            if (!target.classList.contains('search__item'))
                return;
            
            this.clear();
            this._input.value = '';
            
            cb(this._response.items[target.dataset.index]);
        }
        
        let wrapcb = wrapper.bind(this);
        this._cb = wrapcb;

        document.addEventListener('click', this._cb);
    }

    clear() {
        for (let foundRep of this._autoCompleteList.querySelectorAll('li'))
            foundRep.remove();
    }

    debounceUpdate(ms) {
        this.update = this.debounce(this._update, ms);
    }

    debounce(fn, ms) {
        let currentTimeout = null;
        return function wrapper() {
            clearTimeout(currentTimeout);
            
            currentTimeout = setTimeout(() => {
                fn.apply(this, arguments);
            }, ms)
        }
    }

    createElement(tagName, className) {
        let element = document.createElement(tagName);
        if (className)
            element.classList.add(className);
        return element;
    }
}