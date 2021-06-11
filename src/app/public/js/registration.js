const container = document.querySelector('#container');

// buttons
const signUpButton = document.querySelector('#sign-up-button');
const signInButton = document.querySelector('#sign-in-button');

// errors
const signInErrors = document.querySelector('#sign-in-errors');
const signUpErrors = document.querySelector('#sign-up-errors');

// forms
const signUpForm = document.querySelector("#sign-up");
const signInForm = document.querySelector('#sign-in');

//inputs
const firstName = signUpForm.querySelector('#first-name');
const lastName = signUpForm.querySelector('#last-name');
const nationalId = signUpForm.querySelector('#national-id');
const email = signUpForm.querySelector('#email');
const phoneNumber = signUpForm.querySelector('#phone-number');
const password = signUpForm.querySelector('#password');
const gender = signUpForm.querySelector('#gender');

const errorContainer = document.querySelector('.error-container')

//regEX
const nameValidation = /^[A-Za-z]+$/;
const emailValidation = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const nationalValidation = /^([9][0-9]{2}[12][0][0-9]{5})|([2][0]{2}[0-9]{7})$/;
const phoneValidation = /^(009627|9627|\+9627|07)(7|8|9)([0-9]{7})$/;

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

    signUpValidation(body);

    const payload = await fetchRegistration(body);
    if (payload.success) {
        window.location.href = '/';
    } else {
        signUpErrors.textContent = payload.message;
    }

}

// function handleInputFormAction(e){
// }

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


// validation

function redBorder(element){
    element.classList.remove('green-border');
    element.classList.add('red-border');
}

function greenBorder(element){
    element.classList.remove('red-border');
    element.classList.add('green-border');
}

function firstLastNameValidator(element){
    if (element.value.length < 3 || element.value.length > 20){
        redBorder(element);
    } else if (!element.value.match(nameValidation)){
        redBorder(element);
    }else {
        greenBorder(element);
    }
}

function nationalIdValidator(element){
    if (element.value.length === 0){
        redBorder(element)
    } else if (!element.value.match(nationalValidation)){
        redBorder(element);
    } else {
        greenBorder(element)
    }
}

function emailValidator(element){
    if (element.value.length === 0){
        redBorder(element)
    } else if (!element.value.match(emailValidation)){
        redBorder(element);
    } else {
        greenBorder(element)
    }
}

function phoneValidator(element){
    if (element.value.length === 0){
        redBorder(element)
    } else if (!element.value.match(phoneValidation)){
        redBorder(element);
    } else {
        greenBorder(element)
    }
}

function passwordValidator(element){
    if (element.value.length < 6){
        redBorder(element);
    } else {
        greenBorder(element);
    }
}

function genderValidator(element){
    if (element.value ==="gender"){
        redBorder(element)
    } else {
        greenBorder(element)
    }
}

function signUpValidation(body) {
    let message = [];

    if (body.firstName === '') {
        message.push('First name cannot be empty');
        redBorder(firstName);
    } else if (body.firstName.length < 3 || body.firstName.length > 13) {
        message.push('First name should be between 3 characters and 13');
        redBorder(firstName);
    } else if (!body.firstName.match(nameValidation)) {
        message.push('First name should only contain letters ');
        redBorder(firstName);
    }

    if (body.lastName === '') {
        message.push('last name cannot be empty');
        redBorder(lastName);
    } else if (body.lastName.length < 3 || body.firstName.length > 13) {
        message.push('last name should be between 3 characters and 13');
        redBorder(lastName);
    } else if (!body.lastName.match(nameValidation)) {
        message.push('last name should only contain letters ');
        redBorder(lastName);
    }

    if (body.nationalId === ''){
        message.push('National ID cannot be empty')
        redBorder(nationalId);
    } else if (!body.nationalId.match(nationalValidation)){
        message.push('Wrong National ID')
        redBorder(nationalId);
    }

    if (body.email ===''){
        message.push ('Email cannot be empty');
        redBorder(email);
    } else if (!body.email.match(emailValidation)){
        message.push('email is not valid');
        redBorder(email);
    }

    if (body.password < 6){
        message.push("password at least 6 characters");
        redBorder(password);
    }

    if (body.phoneNumber === ''){
        message.push('phone cannot be empty');
        redBorder(phoneNumber);
    } else if (!body.phoneNumber.match(phoneValidation)){
        message.push('invalid phone number');
        redBorder(phoneNumber);
    }

    if (body.gender === "gender"){
        message.push("invalid gender");
        redBorder(gender);
    }

    errorContainer.innerHTML = message.join("<br>");
}


firstName.addEventListener('input' ,() => firstLastNameValidator(firstName));
lastName.addEventListener('input' ,() => firstLastNameValidator(lastName));
nationalId.addEventListener('input' ,() => nationalIdValidator(nationalId));
email.addEventListener('input' ,() => emailValidator(email));
phoneNumber.addEventListener('input' ,() => phoneValidator(phoneNumber));
password.addEventListener('input' ,() => passwordValidator(password));
gender.addEventListener('input' ,() => genderValidator(gender));
