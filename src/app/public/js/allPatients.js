//HBD

const addBtn = document.querySelectorAll('.add-patient');
const removeBtn = document.querySelectorAll('.remove-patient');

addBtn.forEach(btn => btn.addEventListener('click', addPatientHandler));
removeBtn.forEach(btn => btn.addEventListener('click', removePatientHandler));

async function addPatientHandler(e) {
    e.preventDefault();
    const payload = {patientId: e.target.value}; // userId

    const options = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        const response = await fetch('/api/v1/monitor/add-patient', options);
        const body = await response.json();
        console.log(body);
        if (body.success) {
            location.reload();
        } else {
            alert(body.message);
        }
    } catch (e) {
        console.error(e);
    }
}

async function removePatientHandler(e) {
    e.preventDefault();
    const payload = {patientId: e.target.value}; // userId
    console.log(payload);
    const options = {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        const response = await fetch('/api/v1/monitor/remove-patient', options);
        const body = await response.json();
        console.log(body);
        if (body.success) {
            location.reload();
        } else {
            alert(body.message);
        }
    } catch (e) {
        console.error(e);
    }
}
