'use strict';

const validation = form => {
    const formElement = document.querySelector(`${form.form}`);
    const inputElement = formElement.querySelector(`${form.input}`);
    const reminder = inputElement.parentElement.querySelector(
        `${form.rules.notificationSelector}`
    );

    if (!reminder) {
        console.error(
            'Notification selector and input element do not have the same parent element.'
        );
    }

    let invalid = true;
    const showInvalidIcon = () => {
        inputElement.parentElement.classList.add('invalid');
        inputElement.parentElement.classList.remove('valid');
    };
    const showValidIcon = () => {
        inputElement.parentElement.classList.remove('invalid');
        inputElement.parentElement.classList.add('valid');
    };

    inputElement.addEventListener('blur', () => {
        if (form.rules.required && inputElement.value === '') {
            reminder.innerText = 'This field is required.';
            showInvalidIcon();
            return (invalid = true);
        } else if (
            form.rules.min &&
            inputElement.value !== '' &&
            inputElement.value.length < form.rules.min
        ) {
            reminder.innerText = `This field must have at least ${form.rules.min} characters`;
            showInvalidIcon();
            return (invalid = true);
        } else if (
            form.rules.max &&
            inputElement.value !== '' &&
            inputElement.value.length > form.rules.max
        ) {
            reminder.innerText = `This field has a maximum of ${form.rules.max} characters`;
            showInvalidIcon();
            return (invalid = true);
        } else if (form.rules.email && inputElement.value !== '') {
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            const isEmail = emailRegex.test(inputElement.value);

            if (isEmail) {
                reminder.innerText = '';
                showValidIcon();
                return (invalid = false);
            } else {
                reminder.innerText = 'Invalid email address';
                showInvalidIcon();
                return (invalid = true);
            }
        } else {
            reminder.innerText = '';
            showValidIcon();
            return (invalid = false);
        }
    });

    inputElement.addEventListener('input', () => {
        inputElement.parentElement.classList.remove('invalid');
        inputElement.parentElement.classList.remove('valid');
        reminder.innerText = '';
        return (invalid = true);
    });

    formElement.addEventListener('submit', e => {
        if (invalid) {
            e.preventDefault();
            showInvalidIcon();
        }
    });
};

export default validation;
