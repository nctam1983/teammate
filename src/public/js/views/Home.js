import View from './View.js';

export default class extends View {
    constructor(params) {
        super(params);
        this.setTitle('Home | Teammate');
    }

    async getHTML() {
        let url = 'http://localhost:3000/html/home';
        return await (await fetch(url)).json();
    }
}
