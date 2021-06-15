async function deactivateHandler(e, userId, roleName, id) {
    const headers = {
        'Content-Type': 'application/json',
    };
    const options = {
        method: 'DELETE',
        headers,
    };
    const path = `/api/v1/role/${roleName}/${userId}`;
    const response = await fetch(path, options);
    const payload = await response.json();

    if (payload.success) {
        document.getElementById(id).remove();
        location.reload();
    } else {
        alert(payload.message);
    }
}

async function acceptOrRejectHandler(roleName, userId, id, actionType) {
    const headers = {
        'Content-Type': 'application/json',
    };
    const body = {roleName, userId};
    const options = {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers,
    };
    const path = `/api/v1/role/${actionType}`;
    const response = await fetch(path, options);
    const payload = await response.json();

    if (payload.success) {
        document.getElementById(id).remove();
        location.reload();
    } else {
        alert(payload.message);
    }
}

function calcAge(dateString) {
    const birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
}
