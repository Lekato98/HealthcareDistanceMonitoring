const form = document.querySelector('#report');

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
        method: 'POST',
        body: JSON.stringify(data),
        headers,
    };

    try {
        const response = await fetch('/api/v1/report/daily', options);
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