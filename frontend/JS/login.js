const apiBaseUrl = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');
    var correctPassword = '123456'; // Zmień na rzeczywiste poprawne hasło
    var targetPage = '../HTML/admin_panel.html';

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        resetValidationMessages();

        var emailValue = document.getElementById('email').value;
        var passwordValue = document.getElementById('password').value;
        const hashedValue = sha256(passwordValue);

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
        } /*else if (passwordValue !== correctPassword) {
            setValidationMessage('password', 'Hasło jest niepoprawne');
            isValid = false;
        }*/

        if (isValid) {
            const url = apiBaseUrl + "/user/login/" + emailValue + "/" + hashedValue;
            //fetch(apiBaseUrl + "/user/login/" + {emailValue}+"/"+{hashedValue})
            fetch(url, {
                method: 'GET'
              })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Handle successful login
                // Assuming 'data' contains a token or user identifier
                console.log("RESPONSE: ",data)
                //saveAuthDataToLocalStorage(data);
    
                //window.location.href = 'index.html'; // Redirect to index.html
                // TODO: Handle any additional tasks after successful login, e.g., redirecting the user or showing a welcome message
            })
            .catch(error => {
                // Handle login errors
                // For demonstration purposes, we'll just show an alert
                alert('Login failed: ' + error.message);
    
                // TODO: Handle any additional tasks after failed login, e.g., showing a specific error message to the user
            });
            //window.location.href = targetPage;
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
