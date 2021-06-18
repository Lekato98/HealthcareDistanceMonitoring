const client = io('http://localhost:3333', {query: {userId: localStorage.getItem('userId')}});
const notification = document.querySelector('#notifications');
const notificationAudio = document.querySelector('#notification-audio');
const connectedMessage = {
    title: 'Network',
    body: 'Connected Successfully',
    type: 'success',
};
const disconnectedMessage = {
    title: 'Network',
    body: 'Disconnected',
    type: 'danger',
};
let isDisconnected = false; // to show your connection status
notificationAudio.muted = false; // to avoid audio problems

client.on('connect', connectHandler);
client.on('disconnect', disconnectHandler);
client.on('notification', notify);

function connectHandler() {
    if (isDisconnected) {
        notify(connectedMessage);
        isDisconnected = false;
    }
}

function disconnectHandler() {
    notify(disconnectedMessage, false);
    isDisconnected = true;
}

function notify(message, withAudio = true) {
    const notificationItem = document.createElement('div'); // notification holder
    const notificationBody = document.createElement('div'); // content

    const notificationMessageTitle = document.createElement('div'); // notification title
    const notificationMessageBody = document.createElement('div'); // notification body

    const exitIcon = document.createElement('i'); // hide icon

    // time out to auto hide
    const notificationTimeOut = setTimeout(() => removeNotificationHandler('', notificationItem), 3000);

    exitIcon.classList.add('fas', 'fa-times');

    notificationBody.classList.add('notification-exit');
    notificationBody.addEventListener('click', (e) =>
        removeNotificationHandler(e, notificationItem, notificationTimeOut),
    );
    notificationBody.append(exitIcon);

    notificationMessageTitle.classList.add('notification-title');
    notificationMessageBody.classList.add('notification-body');

    notificationMessageTitle.innerText = message.title;
    notificationMessageBody.innerText = message.body;

    notificationItem.classList.add('notification-item', message.type);
    notificationItem.append(notificationMessageTitle);
    notificationItem.append(notificationMessageBody);

    notificationItem.append(notificationBody);

    message.redirectUrl && notification.addEventListener('click', () => {
       location.href = message.redirectUrl;
    });

    notification.append(notificationItem);
    withAudio && notificationAudio.play();
}

function removeNotificationHandler(e, notificationItem, notificationTimeOut) {
    notificationItem?.remove();
    notificationAudio.pause();
    notificationAudio.currentTime = 0;
    clearTimeout(notificationTimeOut);
}
