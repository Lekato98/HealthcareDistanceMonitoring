async function hospitalizeHandler(id){
    const options = {
        method:"DELETE",
        headers :{
            "Content-Type":"application/json"
        },
    }

    try {
        const response = await fetch(`/api/v1/emergency/hospitalize/${id}`, options);
        const body = await response.json();
        if (body.success) {
            alert(body.message);
            location.href = '/emergency-cases';
        } else {
            alert(body.message);
        }
    } catch (err) {
        console.error(err);
    }
}

async function ignoreHandler(id){
    const options = {
        method:"DELETE",
        headers :{
            "Content-Type":"application/json"
        },
    }

    try {
        const response = await fetch(`/api/v1/emergency/${id}`, options);
        const body = await response.json();
        if (body.success) {
            alert(body.message);
            location.href = '/emergency-cases';
        } else {
            alert(body.message);
        }
    } catch (err) {
        console.error(err);
    }
}