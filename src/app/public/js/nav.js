const logout = document.querySelector("#logout");


logout.addEventListener("click" , logoutHandler);


async function logoutHandler(){
    const options = {
        "method":"GET",
    }
    try{
        const response = await fetch("/api/v1/auth/logout" , options);
        const body = await response.json();
        if (body.success) {
            location.href = '/auth/registration';
        } else {
            alert(body.message);
        }
    } catch(e){
        alert(e.message);
    }
}