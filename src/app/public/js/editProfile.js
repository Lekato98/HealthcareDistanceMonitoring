const form = document.querySelector('#edit-profile');

form.addEventListener('submit', submitHandler);

async function submitHandler(e) {
    e.preventDefault();
    const data = $(e.target).serializeArray().reduce((reducer, item) => {
        const object = {};
        object[item.name] = item.value;
        return {...reducer, ...object};
    }, {});

    console.log(data);

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
        console.log(response);
        const body = await response.json();
        console.log(body);
        if (body.success) {
            location.href = '/';
        } else {
            alert(body.message);
        }
    } catch (e) {
        console.error(e);
    }
}