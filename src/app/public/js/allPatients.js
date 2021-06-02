//HBD

const addBtn = document.querySelectorAll("#add-patient");

addBtn.forEach(btn =>{
btn.addEventListener("click" , addPatientHandler);
});

async function addPatientHandler(e){
    e.preventDefault();
    const payload = {patientId: e.value}; // userId

    const options = {
        method : "POST",
        body: JSON.stringify(payload),
        headers :{
            "Content-Type":"application/json"
        }
    }
     try{
         const response = await fetch("/api/v1/monitor/add-patient" , options);
         const body = await response.json();
         if (body.success) {
             location.href = '/';
         } else {
             alert(body.message);
         }
     } catch (e) {
         console.error(e);
     }
}