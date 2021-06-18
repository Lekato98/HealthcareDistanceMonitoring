const report = document.querySelector('#report');
const advice = document.querySelector('#advice');

report.addEventListener('submit', adviceHandler);

async function adviceHandler(e) {
    e.preventDefault();
    const headers = {
        'Content-Type': 'application/json'
    };
    const body = {
        text: advice.value,
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
    };

    try {
        const path = (roleName === 'doctor' ? '/api/v1/doctor-advice/create': '/api/v1/mentor/advice');
        const response = await fetch(path, options);
        const payload = await response.json();
        if (payload.success) {
            alert(payload.message);
            location.href = '/';
        } else {
            alert(payload.message);
        }
    } catch (e) {
        alert(e.message);
    }
}