const avatarInput = document.querySelector('#avatar');
const avatar = document.querySelector('#avatar-av');

avatarInput.addEventListener('change', uploadHandler);

async function uploadHandler(e) {
    const photo = e.target.files[0];
    const formData = new FormData();

    try {
        formData.append('picture', photo);
        const res = await fetch('/api/v1/user/change-avatar', {method: 'POST', body: formData});
        const body = await res.json();
        if (body.success) {
            const message = {
                title: 'Profile',
                body: 'Avatar changed',
                type: 'success',
            };
            avatar.src = body.imageInfo.url;
            notify(message);
        } else {
            const message = {
                title: 'Profile',
                body: body.message,
                type: 'danger',
            };
            notify(message);
        }
    } catch (e) {
        alert(e.message);
    }

}
