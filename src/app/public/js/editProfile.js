const form = document.querySelector('#edit-profile');

form.addEventListener('submit', submitHandler);

async function submitHandler(e) {
    e.preventDefault();
    const data = $(e.target).serializeArray().reduce((reducer, item) => {
        const object = {};
        object[item.name] = item.value;
        return {...reducer, ...object};
    }, {});

    const headers = {
        'Content-Type': 'application/json',
    };

    const options = {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers,
    };

    try {
        const response = await fetch('/api/v1/user', options);
        const body = await response.json();

        if (body.success) {
            location.href = '/profile/me';
        } else {
            alert(body.message);
        }
    } catch (e) {
        console.error(e);
    }
}