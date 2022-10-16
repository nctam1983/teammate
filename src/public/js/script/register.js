import validation from './validator.js';

const $ = document.querySelector.bind(document),
    $$ = document.querySelectorAll.bind(document);

let inputFields = $$('.input_field'),
    inputFieldNames = $$('.input_field_name'),
    checkFormIcons = $$('.checkFormIcon'),
    reminders = $$('.reminder');

inputFields.forEach((box, i) => {
    box.addEventListener('focus', () => {
        inputFieldNames[i].classList.add('active');
        box.style.borderBottom = '2px solid white';
    });
    box.addEventListener('blur', () => {
        if (box.value != '') {
            box.style.borderBottom = 'none';
        } else {
            box.style.borderBottom = '2px solid white';
            inputFieldNames[i].classList.remove('active');
            reminders[i].innerHTML = '';
        }
    });
});

validation({
    form: '.register__form',
    input: '#username',
    rules: {
        notificationSelector: '.reminder',
        required: true,
        min: 8,
    },
});

validation({
    form: '.register__form',
    input: '#password',
    rules: {
        notificationSelector: '.reminder',
        required: true,
        min: 6,
    },
});

validation({
    form: '.register__form',
    input: '#email',
    rules: {
        notificationSelector: '.reminder',
        required: true,
        email: true,
    },
});

validation({
    form: '.register__form',
    input: '#displayname',
    rules: {
        notificationSelector: '.reminder',
        required: true,
    },
});
