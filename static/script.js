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