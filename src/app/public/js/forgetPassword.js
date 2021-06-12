const securityForm = document.querySelector('#report');

securityForm.addEventListener('submit', submitHandler);

async function submitHandler(e) {
    e.preventDefault();
    const body = {
        nationalId: securityForm['nationalId'].value,
        password: securityForm['password'].value,
        question: securityForm['question'].value,
        answer: securityForm['answer'].value,
    };
    const headers = {
        'Content-Type': 'application/json',
    }

    const options = {
        headers,
        method: 'POST',
        body: JSON.stringify(body)
    }

    try {
        const response = await fetch('/api/v1/auth/reset-password', options);
        const {success} = await response.json();
        if (success) {
            alert("Password changed successfully login now :D")
            location.href = '/auth/registration';
        } else {
            alert("Invalid information try again");
        }
    } catch (e) {
        alert(e.message);
    }
}