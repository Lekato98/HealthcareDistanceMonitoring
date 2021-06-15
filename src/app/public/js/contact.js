async function contact(e, to) {
    try {
        const headers = {'Content-Type': 'application/json'};
        const body = {to};
        const options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers
        };

        const response = await fetch('/api/v1/conversation/create', options);
        const payload = await response.json();

        if (payload.success) {
            location.href = `/conversations/${payload.conversation._id}`;
        } else {
            alert(payload.message);
        }
    } catch (e) {
        alert(e.message);
    }
}