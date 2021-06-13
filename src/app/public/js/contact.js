const messageBtn = document.querySelector('#send-message');
const messageBody = document.querySelector('#message-body');
const messagesUl = document.querySelector('#messages');
const chatContainer = document.querySelector(".chat-container");


chatContainer && (chatContainer.scrollTop = chatContainer.scrollHeight);
messageBtn.addEventListener('click', messageHandler);
client.on('receive_message', receiveMessageHandler);

function receiveMessageHandler(message) {
    let html = '';
    if (conversationId !== message.conversationId) {
        return;
    }

    message.date = new Date(message.date);

    if (message.from === me._id) {
        html = `
             <li class="chat-right">
                <div class="chat-hour"> ${message.date.toLocaleString()}</div>
                <div class="chat-text">${message.body}</div>
                <div class="chat-avatar">
                <img src="${me.avatar}"
                alt="${me.firstName}">
                <div class="chat-name">${me.firstName}</div>
                </div>
            </li>
        `
    } else {
        html = `
             <li class='chat-left'>
                <div class="chat-avatar">
                 <img src="${you.avatar}" alt="${you.firstName}">
                <div class="chat-name">${you.firstName}</div>
                </div>
                 <div class="chat-text">${message.body}</div>
                <div class="chat-hour">${message.date.toLocaleString()}</div>
            </li>
        `
    }
    messagesUl.innerHTML += html;

    setTimeout(() => {
        chatContainer && (chatContainer.scrollTop = chatContainer.scrollHeight);
    }, 200);
}

function messageHandler(e) {
    const message = {message: messageBody.value, conversationId, to, from: me}
    client.emit('message', message);
    messageBody.value = "";
}
