/**
 * Stała zawierająca bazowy adres URL API.
 */
const apiBaseUrl = 'http://localhost:8000';

/**
 * Główna funkcja programu.
 */
async function main() {
    // Funkcja pobierająca parametr z adresu URL
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Kontener na dane
    var dataContainer = document.getElementById("data");
    // Odczytanie parametrów z adresu URL
    var numerRejestracyjny = getParameterByName('nr_rej');
    var czasWjazdu = parseInt(getParameterByName('czas')); // Parsowanie czasu wjazdu jako liczbę całkowitą

    // Obliczenie czasu postoju
    var czasPostoju = await obliczCzasPostoju(czasWjazdu);

    // Utworzenie elementów HTML dynamicznie
    var numerRejestracyjnyElement = document.createElement("p");
    numerRejestracyjnyElement.classList.add("mb-4");
    numerRejestracyjnyElement.textContent = "Numer rejestracyjny: " + numerRejestracyjny;

    var czasWjazduElement = document.createElement("p");
    czasWjazduElement.textContent = "Czas wjazdu: " + new Date(czasWjazdu * 1000).toLocaleString();

    var czasPostojuElement = document.createElement("p");
    czasPostojuElement.textContent = "Czas postoju: " + czasPostoju.godziny + " godzin i " + czasPostoju.minuty + " minut";

    var cash;
    cash = await getCash(numerRejestracyjny);

    var cashElement = document.createElement("p");
    var textElement = document.createElement("span");

    textElement.textContent = "Należność ";
    cashElement.textContent = cash.toFixed(2) + " Zł";

    cashElement.style.color = "white";
    // Dodanie elementów do dokumentu
    dataContainer.appendChild(numerRejestracyjnyElement);
    dataContainer.appendChild(czasWjazduElement);
    dataContainer.appendChild(czasPostojuElement);
    dataContainer.appendChild(textElement);
    dataContainer.appendChild(cashElement);

    // Wysłanie żądania POST do API w celu zwolnienia miejsca parkingowego
    fetch(apiBaseUrl + "/spot/free/" + getParameterByName('id'), {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Freed spot response: " + data);
        });
}

/**
 * Funkcja obliczająca czas postoju na podstawie czasu unixowego.
 * @param {number} czasUnix Czas w formacie unixowym.
 * @returns {Object} Obiekt zawierający liczby godzin i minut postoju.
 */
function obliczCzasPostoju(czasUnix) {
    const teraz = new Date();
    const czasPostojuMillis = teraz.getTime() - czasUnix * 1000; // Konwersja sekund na milisekundy
    const czasPostojuMinuty = Math.floor(czasPostojuMillis / (1000 * 60));
    const godziny = Math.floor(czasPostojuMinuty / 60);
    const minuty = czasPostojuMinuty % 60;

    return { godziny, minuty };
}

/**
 * Funkcja pobierająca informacje o należności na podstawie numeru rejestracyjnego pojazdu.
 * @param {string} regnumber Numer rejestracyjny pojazdu.
 * @returns {Promise} Obiekt z danymi dotyczącymi należności.
 */
async function getCash(regnumber) {
    try {
        const response = await fetch(apiBaseUrl + "/rates/" + regnumber);
        const data = await response.json();
        console.log("cash: ", data);
        return data;
    } catch (error) {
        console.error("Wystąpił błąd:", error);
        return null;
    }
}

// Wywołanie funkcji głównej
main();
