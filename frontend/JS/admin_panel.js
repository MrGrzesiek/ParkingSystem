const apiBaseUrl = 'http://localhost:8000';
const spotFree = 0;
const spotTaken = 1;
document.addEventListener("DOMContentLoaded", async function() {
    refreshParkingStatus();
});

async function refreshParkingStatus() {
    // Stan parkingu (liczba dostępnych miejsc)
    var totalParkingSpaces = 0;
    var occupiedParkingSpaces = 0;
    await renderParkingMap();

    // Obliczanie dostępnych miejsc
    //var availableParkingSpaces = calculateParkingStatus(totalParkingSpaces, occupiedParkingSpaces);
    fetch(apiBaseUrl + "/spot/number_of_free_out_of_all") // returns two numbers: number of free spots and number of all spots
        .then(response => response.json())
        .then(data => {
            console.log(data)
            occupiedParkingSpaces = data[0][0]["COUNT(status)"];
            totalParkingSpaces = data[1][0]["COUNT(status)"];
            console.log("occupiedParkingSpaces: " + occupiedParkingSpaces);
            console.log("totalParkingSpaces: " + totalParkingSpaces);
            // Wyświetlanie stanu parkingu
            displayParkingStatus(occupiedParkingSpaces, totalParkingSpaces);
        } )
}

function calculateParkingStatus(totalSpaces, occupiedSpaces) {
    return totalSpaces - occupiedSpaces;
}

function displayParkingStatus(availableSpaces, totalSpaces) {
    var parkingStatusElement = document.getElementById("parking-status");
    parkingStatusElement.innerHTML = availableSpaces + " / " + totalSpaces;
}

function generateParkingSpaces(states) {
    var container = document.getElementById('parkingMap');

    for (var i = 0; i < states.length; i++) {
        var parkingSpace = document.querySelector('#parkingMap .col:nth-child(' + (i + 1) + ')');

        // Jeśli pole parkingowe nie istnieje, tworzymy nowe
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
            parkingSpaceContent.classList.remove('available');
            parkingSpaceContent.classList.add('occupied');
        } else {
            parkingSpaceContent.classList.remove('occupied');
            parkingSpaceContent.classList.add('available');
        }

        (function (parkingNumber) {
            parkingSpaceContent.onclick = function() {
                displaySpotDetails(parkingNumber);
            };
        })(i+1);
    }
}
function displaySpotDetails(parkingNumber) {
    var currentStatusElement = document.getElementById("currentStatus");
    fetch(apiBaseUrl + "/spot/info/" + parkingNumber)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            /* {
    "id": 2,
    "status": 1,
    "reg_number": "EL34",
    "entry_time": "2024-01-25T20:47:43",
    "departure_time": null
}*/
            /*currentStatusElement.textContent = "ID: " + data["id"] + "\n"
                                            + "Status: " + (data["status"] == spotFree ? "Free" : "Occupied") + "\n"
                                            + "Registration number: " + data["reg_number"] + "\n"
                                            + "Entry time: " + data["entry_time"] + "\n"
                                            + "Departure time: " + (data["departure_time"] == "null" ? "None" : data["departure_time"]) + "\n";*/
            currentStatusElement.innerHTML = "<h4>Miejsce " + parkingNumber + "</h4>"
                                            + "<h4>Stan: " + (data["status"] == spotFree ? "Wolne" : "Zajęte") + "</h4>"
                                            + "<h4>Nr. rej: " + data["reg_number"] + "</h4>"
                                            + "<h4>Czas wjazdu: " + data["entry_time"].replace("T", "      ") + "</h4>";
        } )

    var historyElement = document.getElementById("history");
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
    console.log('Wywołanie funkcji co 5 sekund');
  }, 1000);