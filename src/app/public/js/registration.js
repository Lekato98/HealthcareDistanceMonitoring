const container = document.querySelector('#container');

// buttons
const signUpButton = document.querySelector('#sign-up-button');
const signInButton = document.querySelector('#sign-in-button');

// errors
const signInErrors = document.querySelector('#sign-in-errors');
const signUpErrors = document.querySelector('#sign-up-errors');

// forms
const signUpForm = document.querySelector('#sign-up');
const signInForm = document.querySelector('#sign-in');

signInForm.addEventListener('submit', handleSignInSubmitAction);
signUpForm.addEventListener('submit', handleSignUpSubmitAction);

signUpButton.addEventListener('click', handleSignUpClickAction);
signInButton.addEventListener('click', handleSignInClickAction);

async function fetchLogin(payload) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    };
    const response = await fetch('/api/v1/auth/login', options);
    return await response.json();
}

async function fetchRegistration(payload) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    };
    const response = await fetch('/api/v1/auth/register', options);
    return await response.json();
}

function setFormBody(body, element) {
    if (element.name) {
        body[element.name] = element.value;
    }

    return body;
}

async function handleSignInSubmitAction(e) {
    e.preventDefault();
    const elements = Array.from(e.target.elements);
    const body = elements.reduce(setFormBody, {});
    const payload = await fetchLogin(body);
    if (payload.success) {
        window.location.href = '/';
    } else {
        signInErrors.textContent = payload.message;
    }
}

async function handleSignUpSubmitAction(e) {
    e.preventDefault();
    const elements = Array.from(e.target.elements);
    const body = elements.reduce(setFormBody, {});
    const payload = await fetchRegistration(body);
    if (payload.success) {
        window.location.href = '/';
    } else {
        signUpErrors.textContent = payload.message;
    }
}

function handleSignUpClickAction(e) {
    container.classList.add('right-panel-active');
}

function handleSignInClickAction(e) {
    container.classList.remove('right-panel-active');
}

window.getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

// if logged in redirect
window.getCookie('isLoggedIn') && (window.location.href = '/');
