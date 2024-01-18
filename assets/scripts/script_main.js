function isValidEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

const input = document.getElementById('user_email');
const label = document.querySelector('label[for="user_email"]');
const emailSubmissionButton = document.getElementById('email_submission');

emailSubmissionButton.addEventListener('click', () => {
    const oldErrorMessage = document.getElementById('error-message');
    if (oldErrorMessage) {
        oldErrorMessage.remove();
    }
    if (isValidEmail(input.value)) {
        window.location.href = 'login.html?email=' + encodeURIComponent(input.value);
    }     
    else {
        input.style.borderColor = 'red';
        const errorMessage = document.createElement("div");
        errorMessage.textContent = "Invalid Email Address";
        errorMessage.style.color = 'red';
        errorMessage.id = 'error-message';
        input.parentNode.appendChild(errorMessage);
    }
});


window.onload = _ => {
    const input = document.getElementById('user_email');
    const label = document.querySelector('label[for="user_email"]');
    if (input.value.trim() !== '') {
        label.classList.remove('def-label');
        label.classList.add('onclick-label');
    }
    input.addEventListener('focus', function() {
        label.classList.remove('def-label');
        label.classList.add('onclick-label');
    });
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            label.classList.remove('onclick-label');
            label.classList.add('def-label');
        }
    });
}
