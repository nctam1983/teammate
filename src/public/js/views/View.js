export default class {
    constructor(params) {
        this.params = params;
    }

    setTitle(title) {
        document.title = title;
    }

    async getHTML(page) {
        let url = 'http://localhost:3000/html/' + page;
        return await (await fetch(url)).json();
    }
}
