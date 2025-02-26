async function updatePage() {
    if (document.getElementById('header') == null) {
        header = document.createElement('div');
        header.id = 'header';
        document.body.insertBefore(header, document.body.firstChild);
    }
    if (document.getElementById('content') == null) {
        content = document.createElement('div');
        content.id = 'content';
        document.body.appendChild(content);
    }
    document.title = "ScratchUI";
    if (getCookie("session")) {
        try { document.getElementById('login').style.display = 'none'; } catch (e) {}
    }
    await updateHeader();
}

async function updateHeader() {
    document.getElementById('header').innerHTML = '';
    function headerItem(name, onclick=null, image=null, classList=null) {
        element = document.createElement('div');
        element.classList.add('header-item');
        if (classList) {
            classList.forEach((c) => element.classList.add(c));
        }
        element.innerText = name;
        if (image) {
            imageElement = document.createElement('img');
            imageElement.src = image;
            element.appendChild(imageElement);
        }
        element.onclick = onclick;
        document.getElementById('header').appendChild(element);
    }
    headerItem('About')
    username = getCookie("username")
    if (username) {
        url = await fetchUserProfile(username);
        headerItem(username, () => window.location.href = `/users/${username}`, url, ['header-item-username']);
    } else {
        url = await fetchUserProfile('default');
        headerItem('Not Logged In', null, url, ['header-item-username']);
    }
}

async function fetchUserProfile(username) {
    const response = await fetch(`/api/user/${username}/image`);
    const data = await response.json();
    return data.image;
}

async function login() {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
        setCookie("session", data.session, 7);
        setCookie("username", data.username, 7);
        await updatePage();
    } else {
        console.error(data.error);
        alert('Invalid username or password');
    }   
}

function setCookie(name, value, days=null) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    } else {
        expires = '';
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

updatePage();

function alert(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';

        const ca = document.createElement('div');
        ca.classList.add('alert');

        const messagePara = document.createElement('p');
        messagePara.innerText = message;
        ca.appendChild(messagePara);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'OK';
        closeButton.onclick = function() {
            ca.style.transition = 'all 0.3s ease';
            ca.style.transform = 'scale(0.01)';
            setTimeout(function () {
                document.body.removeChild(ca);
                document.body.removeChild(overlay);
                resolve();
            }, 300);
        };
        const closeButtonContainer = document.createElement('div');
        closeButtonContainer.appendChild(closeButton);
        ca.appendChild(closeButtonContainer);

        document.body.appendChild(overlay);
        document.body.appendChild(ca);

        ca.style.transition = 'none';
        ca.style.transform = 'scale(0.01)';
        requestAnimationFrame(function() {
            ca.style.transition = 'transform 0.3s ease';
            ca.style.transform = 'scale(1)';
        });
    });
}