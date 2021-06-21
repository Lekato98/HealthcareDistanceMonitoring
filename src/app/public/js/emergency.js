const reason = document.querySelector("#reason");
const form = document.querySelector("#report");

form.addEventListener('submit' , submitHandler);

async function submitHandler (e){
    e.preventDefault();
    const data = {reason: reason.value};
    const options = {
        method:"POST",
        body:JSON.stringify(data),
        headers :{
            "Content-Type":"application/json"
        },
    }
    try {
        const response = await fetch('/api/v1/emergency', options);
        const body = await response.json();
        if (body.success) {
            location.href = '/';
        } else {
            alert(body.message);
        }

    } catch(err){
        console.error(err);
    }
}
