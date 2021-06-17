const messageBtn = document.querySelector('#send-message');
const messageBody = document.querySelector('#message-body');
const messagesUl = document.querySelector('#messages');


messagesUl && (messagesUl.scrollTop = messagesUl.scrollHeight);
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
<li class="left clearfix">
                    <span class="chat-img pull-left">
                    <img src="${me.avatar}"
                                 alt="${me.firstName}">
                    </span>
                                        <div class="chat-body clearfix">
                                            <div class="header">
                                                <strong class="primary-font">${me.firstName}</strong>
                                                <small class="pull-right text-muted"><i
                                                            class="fa fa-clock-o"></i> ${message.date.toLocaleString()}
                                                </small>
                                            </div>
                                            <p>
                                                ${message.body}
                                            </p>
                                        </div>
                                    </li>
        `
    } else {
        html = `
             <li class="right clearfix">
                    	<span class="chat-img pull-right">
                    		<img src="${you.avatar}" alt="${you.firstName}">
                    	</span>
                                        <div class="chat-body clearfix">
                                            <div class="header">
                                                <strong class="primary-font">${you.firstName}</strong>
                                                <small class="pull-right text-muted"> <i class="fa fa-clock-o"></i>
                                                    ${message.date.toLocaleString()}</small>
                                            </div>
                                            <p>
                                                ${message.body}
                                            </p>
                                        </div>
                                    </li>
        `
    }
    messagesUl.innerHTML += html;

    setTimeout(() => {
        messagesUl && (messagesUl.scrollTop = messagesUl.scrollHeight);
    }, 200);
}

function messageHandler(e) {
    const message = {message: messageBody.value, conversationId, to, from: me}
    client.emit('message', message);
    messageBody.value = "";
}
