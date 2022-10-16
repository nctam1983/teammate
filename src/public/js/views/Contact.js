import View from './View.js';

export default class extends View {
    constructor(params) {
        super(params);
        this.setTitle('Contact | Teammate');
    }

    async getHTML() {
        let url = 'http://localhost:3000/html/contact';
        return await (await fetch(url)).json();
    }
}
