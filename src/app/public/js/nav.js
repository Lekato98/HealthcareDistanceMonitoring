const logout = document.querySelector('#logout');
const patient = document.querySelector('#patient-role');
const mentor = document.querySelector('#mentor-role');
const doctor = document.querySelector('#doctor-role');
const removeNotifications = document.querySelectorAll('.noti-remove');

// logout event
logout.addEventListener('click', logoutHandler);

// switch event
patient.addEventListener('click', (e) => switchRoleHandler(e, 'patient'));
mentor.addEventListener('click', (e) => switchRoleHandler(e, 'mentor'));
doctor.addEventListener('click', (e) => switchRoleHandler(e, 'doctor'));

// remove notification event
removeNotifications.forEach((notification, index) =>
    notification.addEventListener('click', () => removeHandler(notification.parentElement, index)),
);

async function switchRoleHandler(e, roleName) {
    const headers = {'Content-Type': 'application/json'};
    const body = {roleName};
    const options = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers,
    };

    try {
        const response = await fetch('/api/v1/role/switch', options);
        console.log(response);
        const payload = await response.json();
        if (payload.success) {
            location.href = '/';
        } else {
            alert(payload.message);
        }
    } catch (e) {
        alert(e.message);
    }
}

async function removeHandler(element, index) {
    try {
        const options = {'method': 'DELETE'};
        const response = await fetch(`/api/v1/user/remove-notification/${index}`, options);
        const body = await response.json();
        if (body.success) {
            element.parentElement.remove();
            const message = {
                title: 'Notification',
                body: 'Removed Successfully',
                type: 'success',
            };
            notify(message, false);
        } else {
            const message = {
                title: 'Server',
                body: body.message,
                type: 'danger',
            };

            notify(message);
        }
    } catch (e) {
        alert(e.message);
    }
}

async function logoutHandler() {
    try {
        const options = {'method': 'GET'};
        const response = await fetch('/api/v1/auth/logout', options);
        const body = await response.json();
        if (body.success) {
            location.href = '/auth/registration';
        } else {
            alert(body.message);
        }
    } catch (e) {
        alert(e.message);
    }
}
