/**
 * Funkcja obsługująca zdarzenie załadowania struktury DOM.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Pobranie formularza logowania
    var loginForm = document.getElementById('loginForm');

    // Dodanie nasłuchiwacza zdarzenia submit dla formularza logowania
    loginForm.addEventListener('submit', function (event) {
        // Zapobieganie domyślnej akcji przeglądarki (przeładowanie strony po wysłaniu formularza)
        event.preventDefault();

        // Zresetowanie komunikatów walidacyjnych
        resetValidationMessages();

        // Pobranie wartości pola email
        var emailValue = document.getElementById('email').value;
        // Pobranie elementu feedback, gdzie będą wyświetlane komunikaty
        var feedbackElement = document.getElementById('feedback');

        // Zmienna określająca poprawność danych w formularzu
        var isValid = true;

        // Walidacja pola email
        if (emailValue.trim() === '') {
            // Jeśli pole email jest puste, ustaw komunikat o błędzie
            setValidationMessage('email', 'Adres email jest wymagany');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            // Jeśli pole email nie spełnia wymagań formatu, ustaw komunikat o błędzie
            setValidationMessage('email', 'Adres email jest niepoprawny');
            isValid = false;
        }

        // Jeśli dane są poprawne, wyświetl komunikat o sukcesie
        if (isValid) {
            feedbackElement.textContent = 'Na podany email wysłano link do resetu hasła';
            // Zresetowanie formularza
            loginForm.reset();
        }
    });

    /**
     * Funkcja sprawdzająca poprawność formatu adresu email.
     * @param {string} email Adres email do sprawdzenia.
     * @returns {boolean} Wartość logiczna informująca, czy adres email jest poprawny.
     */
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Funkcja ustawiająca komunikat walidacyjny pod polem formularza.
     * @param {string} fieldId Identyfikator pola formularza.
     * @param {string} message Komunikat walidacyjny.
     */
    function setValidationMessage(fieldId, message) {
        var field = document.getElementById(fieldId);
        // Dodanie klasy 'is-invalid' do pola formularza dla wizualnego oznaczenia błędu
        field.classList.add('is-invalid');

        // Pobranie elementu, w którym będzie wyświetlony komunikat walidacyjny
        var feedbackElement = field.nextElementSibling;
        feedbackElement.textContent = message;
    }

    /**
     * Funkcja resetująca komunikaty walidacyjne w formularzu.
     */
    function resetValidationMessages() {
        // Pobranie wszystkich pól formularza
        var formFields = loginForm.querySelectorAll('.form-control');
        // Iteracja przez wszystkie pola i usunięcie klasy 'is-invalid', oraz wyczyszczenie komunikatów walidacyjnych
        formFields.forEach(function (field) {
            field.classList.remove('is-invalid');
            var feedbackElement = field.nextElementSibling;
            feedbackElement.textContent = '';
        });

        // Zresetowanie komunikatu w elemencie feedback
        document.getElementById('feedback').textContent = '';
    }
});
