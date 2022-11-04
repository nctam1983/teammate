import Home from './views/Home.js';
import Contact from './views/Contact.js';
import Personal from './views/Personal.js';

const navigate = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: '/', view: Home },
        { path: '/contact', view: Contact },
        { path: '/personal', view: Personal },
    ];

    const filterRoute = routes.map(route => ({
        route,
        isMatch: route.path === location.pathname,
    }));

    let result = filterRoute.find(route => route.isMatch);

    if (!result) {
        result = {
            route: routes[0],
            isMatch: true,
        };
    }

    const page = result.route.path.substr(0, 1) || 'home';
    const view = new result.route.view();
    let html = await view.getHTML();

    document.querySelector('#container').innerHTML = html;
};

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('popstate', router);

const links = [...document.querySelectorAll('.link')];
links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.nav--items.active').classList.remove('active')
        this.parentElement.classList.add('active');
        navigate(this.href);
    });
});

const navBar = document.querySelector('#navBar');

navBar.addEventListener('mouseenter', function() {
    this.classList.add('hover');
});

navBar.addEventListener('mouseleave', function() {
    this.classList.remove('hover');
});
