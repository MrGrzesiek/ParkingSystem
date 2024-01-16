document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');
    var correctPassword = '123456'; // Zmień na rzeczywiste poprawne hasło
    var targetPage = '../HTML/admin_panel.html';

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        resetValidationMessages();

        var emailValue = document.getElementById('email').value;
        var passwordValue = document.getElementById('password').value;

        var isValid = true;

        if (emailValue.trim() === '') {
            setValidationMessage('email', 'Email jest wymagany');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setValidationMessage('email', 'Email jest niepoprawny');
            isValid = false;
        }

        if (passwordValue.trim() === '') {
            setValidationMessage('password', 'Hasło jest wymagane');
            isValid = false;
        } else if (passwordValue !== correctPassword) {
            setValidationMessage('password', 'Hasło jest niepoprawne');
            isValid = false;
        }

        if (isValid) {
            window.location.href = targetPage;
        }
    });

    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function setValidationMessage(fieldId, message) {
        var field = document.getElementById(fieldId);
        field.classList.add('is-invalid');

        var feedbackElement = field.nextElementSibling;
        feedbackElement.textContent = message;
    }

    function resetValidationMessages() {
        var formFields = loginForm.querySelectorAll('.form-control');
        formFields.forEach(function (field) {
            field.classList.remove('is-invalid');

            var feedbackElement = field.nextElementSibling;
            feedbackElement.textContent = '';
        });
    }
});