const patient = document.querySelector('#patient-role');

patient.addEventListener('click' , switchToPatientHandler);

async function switchToPatientHandler(e , roleName){
    e.preventDefault();
    const data = {roleName};
    const headers = {
        "Content-Type": "application/json"
    };
    const options ={
        method : "POST",
        headers,
        body : JSON.stringify(data)
    };

    try {
        const response = await fetch('localhost:3333/api/v1/role' , options);

    } catch (e) {

    }
}