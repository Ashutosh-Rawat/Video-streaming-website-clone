// JavaScript
async function showLoader() {
    // Create style element for loader
    let style = document.createElement('style');
    style.innerHTML = `
    body {
        background-color: black;
        overflow-y: hidden;
    }
    .dot-loader {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100px;
        height: 50px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
    }

    .dot-loader div {
        width: 10px;
        height: 10px;
        background-color: white;
        border-radius: 50%;
        opacity: 0.6;
        animation: dot-loader 1.4s ease-in-out infinite;
    }

    .dot-loader div:nth-child(1) { animation-delay: 0.2s; }
    .dot-loader div:nth-child(2) { animation-delay: 0.4s; }
    .dot-loader div:nth-child(3) { animation-delay: 0.6s; }
    .dot-loader div:nth-child(4) { animation-delay: 0.8s; }
    .dot-loader div:nth-child(5) { animation-delay: 1s; }

    @keyframes dot-loader {
        0%, 80%, 100% { transform: scale(0.4); }
        40% { transform: scale(1); }
    }

    .hidden { visibility: hidden; }
    `;
    document.head.appendChild(style);

    // Hide the first child of the body
    let firstChild = document.body.children[0];
    firstChild.classList.add('hidden');

    // Create loader
    let loader = document.createElement('div');
    loader.className = 'dot-loader';
    for (let i = 0; i < 5; i++) {
        let dot = document.createElement('div');
        loader.appendChild(dot);
    }
    document.body.appendChild(loader);

    // Hide loader and show content after 3 seconds
    setTimeout(() => {
        loader.style.display = 'none';
        firstChild.classList.remove('hidden');
        document.body.style.overflowY = 'auto'
    }, 3000);
}
