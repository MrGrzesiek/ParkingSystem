const apiBaseUrl = 'http://localhost:8000';
const spotFree = 0;
const spotTaken = 1;
const maxHistoryRecords = 5;
var currentNumber=1;
const userLoggedIn = localStorage.getItem('login');
if(userLoggedIn){
document.addEventListener("DOMContentLoaded", async function() {
    renderParkingMap();
    refreshParkingStatus();
    displaySpotDetails(currentNumber);
    displaySpotHistory(currentNumber);
});

/**
 * Funkcja refreshParkingStatus odświeża status parkingu, pobierając aktualne informacje o liczbie wolnych miejsc.
 */
async function refreshParkingStatus() {
    // Stan parkingu (liczba dostępnych miejsc)
    var totalParkingSpaces = 0;
    var occupiedParkingSpaces = 0;
    
    // Odświeżenie mapy parkingu
    await renderParkingMap();

    // Wywołanie API w celu pobrania liczby wolnych miejsc
    fetch(apiBaseUrl + "/spot/number_of_free_out_of_all")
        .then(response => response.json())
        .then(data => {
            // Pobranie liczby zajętych i wszystkich miejsc parkingowych
            occupiedParkingSpaces = data[0][0]["COUNT(status)"];
            totalParkingSpaces = data[1][0]["COUNT(status)"];
            // Wyświetlenie stanu parkingu
            displayParkingStatus(occupiedParkingSpaces, totalParkingSpaces);
        })
        .catch(error => {
            console.error("Błąd podczas odświeżania stanu parkingu:", error);
        });
}


/**
 * Funkcja displayParkingStatus aktualizuje status parkingu na podstawie liczby dostępnych miejsc.
 * 
 * @param {number} availableSpaces Liczba dostępnych miejsc parkingowych.
 * @param {number} totalSpaces Całkowita liczba miejsc parkingowych na parkingu.
 */
function displayParkingStatus(availableSpaces, totalSpaces) {
    // Pobranie elementu HTML, gdzie będzie wyświetlony status parkingu
    var parkingStatusElement = document.getElementById("parking-status");

    // Aktualizacja tekstu w zależności od liczby dostępnych miejsc
    if (availableSpaces > 0)
        parkingStatusElement.innerHTML = (50 - availableSpaces) + " / " + totalSpaces;
    else
        parkingStatusElement.innerHTML = "Parking pełny";
}


/**
 * Funkcja generateParkingSpaces tworzy miejsca parkingowe na mapie w zależności od ich stanu.
 * 
 * @param {number[]} states Tablica stanów miejsc parkingowych, gdzie 0 oznacza wolne miejsce, a 1 zajęte miejsce.
 */
function generateParkingSpaces(states) {
    // Pobranie kontenera, gdzie będą umieszczone miejsca parkingowe
    var container = document.getElementById('parkingMap');

    // Iteracja przez wszystkie miejsca parkingowe
    for (var i = 0; i < states.length; i++) {
        var parkingSpace = document.querySelector('#parkingMap .col:nth-child(' + (i + 1) + ')');

        // Jeśli miejsce parkingowe nie istnieje, tworzymy nowe
        if (!parkingSpace) {
            parkingSpace = document.createElement('div');
            parkingSpace.className = 'col';

            var parkingSpaceContent = document.createElement('div');
            parkingSpaceContent.className = 'parking-space text-center';
            parkingSpaceContent.textContent = i + 1;

            parkingSpace.appendChild(parkingSpaceContent);
            container.appendChild(parkingSpace);
        }

        // Aktualizacja stanu i ustawienie koloru tła odpowiednio
        var parkingSpaceContent = parkingSpace.querySelector('.parking-space');
        if (states[i] === 1) {
            // Jeśli miejsce jest zajęte, ustawiamy odpowiedni klasę CSS
            parkingSpaceContent.classList.remove('available');
            parkingSpaceContent.classList.add('occupied');
        } else {
            // Jeśli miejsce jest wolne, ustawiamy odpowiedni klasę CSS
            parkingSpaceContent.classList.remove('occupied');
            parkingSpaceContent.classList.add('available');
        }

        // Dodanie funkcji obsługi zdarzenia kliknięcia na miejsce parkingowe
        (function (parkingNumber) {
            parkingSpaceContent.onclick = function() {
                // Po kliknięciu aktualizujemy numer bieżącego miejsca i wyświetlamy jego szczegóły oraz historię
                currentNumber = parkingNumber;
                displaySpotDetails(parkingNumber);
                displaySpotHistory(parkingNumber);
            };
        })(i + 1);
    }
}

/**
 * Funkcja displaySpotHistory pobiera historię parkowania dla danego miejsca parkingowego i wyświetla ją na stronie.
 * 
 * @param {number} parkingNumber Numer miejsca parkingowego, dla którego wyświetlana jest historia parkowania.
 */
async function displaySpotHistory(parkingNumber) {
    // Pobranie elementu HTML, gdzie zostanie wyświetlona historia parkowania
    var historyElement = document.getElementById("history");
    // Wywołanie API w celu pobrania historii parkowania dla danego miejsca parkingowego
    fetch(apiBaseUrl + "/spot/history/" + parkingNumber)
        .then(response => response.json())
        .then(data => {
            // Maksymalna liczba rekordów historii to 5
            var historyRecords = data.length;
            historyElement.innerHTML = "";
            // Wyświetlenie każdego rekordu historii na stronie
            for (var i = 0; i < historyRecords && i < maxHistoryRecords; i++) {
                historyElement.innerHTML += "<h4> Nr. rej: " + data[i]["reg_number"] + "</h4> " +
                    "<h4> Czas wjazdu: " + data[i]["entry_time"].replace("T", "      ") + "</h4> " +
                    "<h4> Czas wyjazdu: " + data[i]["departure_time"].replace("T", "      ") + "</h4> " + "<br><hr>";
            }
        })
        .catch(error => {
            // Obsługa błędu w przypadku niepowodzenia pobrania historii parkowania
            console.error(error);
            historyElement.innerHTML = "Błąd podczas pobierania historii parkowania.";
        });
}


/**
 * Funkcja displaySpotDetails odpowiedzialna jest za wyświetlenie szczegółowych informacji na temat wybranego miejsca parkingowego.
 * 
 * @param {number} parkingNumber Numer miejsca parkingowego, dla którego wyświetlane są szczegóły.
 */
function displaySpotDetails(parkingNumber) {
    // Pobranie elementu HTML, gdzie zostaną wyświetlone szczegóły miejsca parkingowego
    var currentStatusElement = document.getElementById("currentStatus");
    // Wywołanie API w celu uzyskania informacji na temat danego miejsca parkingowego
    fetch(apiBaseUrl + "/spot/info/" + parkingNumber)
        .then(response => response.json())
        .then(async (data) => {
            // Pobranie nazwy zdjęcia samochodu dla danego miejsca parkingowego
            var photoName = data["photo_name"];
            photoName = "../RESOURCES/CAR PHOTO/" + photoName;
            // Pobranie aktualnej opłaty za parkowanie na podstawie numeru rejestracyjnego pojazdu
            var cash = await getCash(data["reg_number"]);
            cash = cash.toFixed(2);
            // Wyświetlenie szczegółów miejsca parkingowego
            currentStatusElement.innerHTML = '<img src="' + photoName + '" style="max-width: 100%; height: auto; margin-bottom: 20px;" class="mb-4" alt="Car Photo">' + "<br>" +
                "<h4>Miejsce " + parkingNumber + "</h4>" +
                "<h4>Stan: " + (data["status"] == spotFree ? "Wolne" : "Zajęte") + "</h4>" +
                "<h4>Nr. rej: " + data["reg_number"] + "</h4>" +
                "<h4>Czas wjazdu: " + data["entry_time"].replace("T", "      ") + "\n" + "</h4>" +
                "<h4>Aktualna opłata " + cash + "Zł</h4>";
        })
        .catch(error => {
            // Obsługa błędu w przypadku niepowodzenia pobrania informacji o miejscu parkingowym
            var photoName = "../RESOURCES/CAR PHOTO/" + "free.jpg";
            currentStatusElement.innerHTML = '<img src="' + photoName + '" style="max-width: 100%; height: auto; margin-bottom: 20px;" class="mb-4" alt="Car Photo">' + "<br>" +
                "<h4>Miejsce " + parkingNumber + "</h4>" +
                "<h4>Stan: Wolne" + "</h4>";
            console.error(error);
        });
}
async function getParkingStatus(){
    try{
        const response = await fetch(apiBaseUrl + "/spot/all");
        const data = await response.json();
        return data;
    }
    catch(error)
    {
        console.error("Error:", error);
        alert("NIE NAWIAZANO POLACZENIA\n " + error);
    }
}
function extractStatusArray(data) {
    return data.map(item => item.status);
}
async function renderParkingMap(){
    var parkingMap = await getParkingStatus();
    const statusArray = extractStatusArray(parkingMap);
    generateParkingSpaces(statusArray);
}
setInterval(() => {
    renderParkingMap();
    refreshParkingStatus();
    displaySpotDetails(currentNumber);
    displaySpotHistory(currentNumber);
    //console.log('Wywołanie funkcji co 5 sekund');
  }, 10000);
}
async function getCash(regnumber) {
    try {
      const response = await fetch(apiBaseUrl + "/rates/" + regnumber);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      return null;
    }
  }