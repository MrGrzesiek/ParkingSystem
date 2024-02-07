/**
 * Bazowy adres URL API.
 * @type {string}
 */
const apiBaseUrl = 'http://localhost:8000';

/**
 * Funkcja wywoływana po załadowaniu całej zawartości strony.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Pobranie formularza logowania
    var loginForm = document.getElementById('loginForm');
    // Element wyświetlający błędy
    var errorElement = document.getElementById('errormessage');

    // Obsługa zdarzenia wysłania formularza
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Zatrzymanie domyślnej akcji wysłania formularza
        resetValidationMessages(); // Zresetowanie komunikatów walidacji

        // Pobranie wartości emaila i hasła
        var emailValue = document.getElementById('email').value;
        var passwordValue = document.getElementById('password').value;
        const hashedValue = sha256(passwordValue); // Wygenerowanie skrótu hasła

        var isValid = true;

        // Walidacja pola email
        if (emailValue.trim() === '') {
            setValidationMessage('email', 'Email jest wymagany');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setValidationMessage('email', 'Email jest niepoprawny');
            isValid = false;
        }

        // Walidacja pola hasła
        if (passwordValue.trim() === '') {
            setValidationMessage('password', 'Hasło jest wymagane');
            isValid = false;
        }

        // Jeśli walidacja przebiegła pomyślnie, wysyłamy żądanie logowania
        if (isValid) {
            const url = apiBaseUrl + "/user/login/" + emailValue + "/" + hashedValue;
            fetch(url, {
                method: 'POST'
              })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("RESPONSE: ",data)
                // Zapisujemy login i id użytkownika w localStorage
                localStorage.setItem('login', emailValue);
                localStorage.setItem('id', data["id"]);
                errorElement.textContent = "";
                window.location.href = 'admin_panel.html'; // Przekierowanie do panelu administratora
            })
            .catch(error => {
                // Obsługa błędów logowania
                console.log('Login failed: ' + error.message);
                errorElement.textContent = "Autoryzacja nieudana";
            });
        }
    });

    /**
     * Sprawdza poprawność formatu adresu email.
     * @param {string} email - Adres email.
     * @returns {boolean} True, jeśli adres email jest poprawny, w przeciwnym razie false.
     */
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Ustawia komunikat walidacji dla danego pola formularza.
     * @param {string} fieldId - Identyfikator pola formularza.
     * @param {string} message - Komunikat walidacji.
     */
    function setValidationMessage(fieldId, message) {
        var field = document.getElementById(fieldId);
        field.classList.add('is-invalid');

        var feedbackElement = field.nextElementSibling;
        feedbackElement.textContent = message;
    }

    /**
     * Resetuje komunikaty walidacji.
     */
    function resetValidationMessages() {
        var formFields = loginForm.querySelectorAll('.form-control');
        formFields.forEach(function (field) {
            field.classList.remove('is-invalid');

            var feedbackElement = field.nextElementSibling;
            feedbackElement.textContent = '';
        });
    }
    
});
