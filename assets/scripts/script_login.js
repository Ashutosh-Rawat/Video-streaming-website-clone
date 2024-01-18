const urlParams = new URLSearchParams(window.location.search)
const email = urlParams.get('email')
document.getElementById('emailId').value = email
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
const emailInput = document.getElementById('emailId')
const passwordInput = document.getElementById('passwd')
const signinButton = document.getElementById('signinbtn')

const isValid = (value, regex) => regex.test(value)
const showError = (input, message) => {
    const oldErrorMessage = document.getElementById(`${input.id}-error-message`)
    if (oldErrorMessage) {
        oldErrorMessage.remove()
    }
    input.style.borderColor = 'red'
    const errorMessage = document.createElement("div")
    errorMessage.textContent = message
    errorMessage.style.color = 'red'
    errorMessage.id = `${input.id}-error-message`
    input.parentNode.appendChild(errorMessage)
}
const validateInput = (input, regex, message) => {
    const oldErrorMessage = document.getElementById(`${input.id}-error-message`)
    if (oldErrorMessage) {
        oldErrorMessage.remove()
    }
    if (isValid(input.value, regex)) {
        input.style.borderColor = ''
        return true
    } else {
        showError(input, message)
        return false
    }
}
const validateAndShowError = (input, regex, message) => {
    const isValidInput = validateInput(input, regex, message)
    if (!isValidInput) {
        showError(input, message)
    } else {
        const oldErrorMessage = document.getElementById(`${input.id}-error-message`)
        if (oldErrorMessage) {
            oldErrorMessage.remove()
        }
        input.style.borderColor = ''
    }
    return isValidInput
}

signinButton.addEventListener('click', (event) => {
    const isEmailValid = validateAndShowError(emailInput, emailRegex, "Invalid Email Address")
    const isPasswordValid = passwordInput.value.length > 4
    if (!isPasswordValid) {
        showError(passwordInput, "Invalid Password")
    }
    if (isEmailValid && isPasswordValid) {
        var username = ((emailInput.value).split('@'))[0]
        window.location.href = 'home.html?username=' + encodeURIComponent(username)
    } else {
        event.preventDefault()
    }
})

emailInput.addEventListener('input', () => {
    validateAndShowError(emailInput, emailRegex, "Invalid Email Address")
})

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length <= 4) {
        showError(passwordInput, "Invalid Password")
    } else {
        const oldErrorMessage = document.getElementById(`${passwordInput.id}-error-message`)
        if (oldErrorMessage) {
            oldErrorMessage.remove()
        }
        passwordInput.style.borderColor = ''
    }
})

const toggleLabel = (input, label) => {
    label.classList.toggle('def-label', input.value.trim() === '')
    label.classList.toggle('onclick-label', input.value.trim() !== '')
}

window.onload = () => {
    [emailInput, passwordInput].forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`)
        toggleLabel(input, label);
        ['focus', 'blur', 'input'].forEach(event => {
            input.addEventListener(event, () => toggleLabel(input, label))
        })
        input.addEventListener('click', () => {
            label.classList.add('onclick-label')
        })
    })
}
