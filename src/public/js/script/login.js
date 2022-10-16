import validation from './validator.js';

validation({
    form: '.login__form',
    input: '#username',
    rules: {
        notificationSelector: '.reminder',
        required: true,
        min: 8,
    },
});

validation({
    form: '.login__form',
    input: '#password',
    rules: {
        notificationSelector: '.reminder',
        required: true,
        min: 6,
    },
});

const $ = document.querySelector.bind(document);
const form = $('.login__form');
const username = form.querySelector('#username');
const password = form.querySelector('#password');
const usernameReminder = form
    .querySelector('#username')
    .parentElement.querySelector('.reminder');
const passwordReminder = form
    .querySelector('#password')
    .parentElement.querySelector('.reminder');

form.addEventListener('submit', e => {
    e.preventDefault();
    const valid =
        !usernameReminder.value &&
        !passwordReminder.value &&
        !!username.value &&
        !!password.value;

    if (valid) {
        axios
            .post('/user/login', {
                username: username.value,
                password: password.value,
            })
            .then(response => {
                const data = response.data;
                console.log(data);
                if (data.field === 'username')
                    return (usernameReminder.innerText = data.message);
                if (data.field === 'password')
                    return (passwordReminder.innerText = data.message);
                window.location = data.path;
            })
            .catch(error => {
                console.error(error);
            });
    }
});
