const notification = document.querySelector('#notifications');
const notificationAudio = document.querySelector('#notification-audio');
notificationAudio.muted = false;

const client = io('http://localhost:3333');
let isDisconnected = false;

client.on('connect', () => {
    if (isDisconnected) {
        notify('Connected', 'success');
        isDisconnected = false;
    }
});

client.on('disconnect', () => {
    notify('Disconnected', 'danger', false);
    isDisconnected = true;
});

client.on('notification', notify);

function notify(message, messageType, withAudio = true) {
    const notificationItem = document.createElement('div');
    const notificationBody = document.createElement('div');
    const exitIcon = document.createElement('i');
    const notificationTimeOut = setTimeout(() => removeNotificationHandler('', notificationItem), 3000);

    exitIcon.classList.add('fas', 'fa-times');

    notificationBody.classList.add('notification-exit');
    notificationBody.addEventListener('click', (e) =>
        removeNotificationHandler(e, notificationItem, notificationTimeOut),
    );
    notificationBody.append(exitIcon);

    notificationItem.classList.add('notification-item', messageType);
    notificationItem.innerText = message;
    notificationItem.append(notificationBody);

    notification.append(notificationItem);
    if (withAudio) {
        notificationAudio.play();
    }
}

function removeNotificationHandler(e, notificationItem, notificationTimeOut) {
    notificationItem?.remove();
    notificationAudio.pause();
    notificationAudio.currentTime = 0;
    clearTimeout(notificationTimeOut);
}
