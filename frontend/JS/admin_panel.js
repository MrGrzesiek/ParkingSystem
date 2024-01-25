const apiBaseUrl = 'http://localhost:8000';
const spotFree = 0;
const spotTaken = 1;
const maxHistoryRecords = 5;
document.addEventListener("DOMContentLoaded", async function() {
    await refreshParkingStatus();
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
            //console.log("occupiedParkingSpaces: " + occupiedParkingSpaces);
            //console.log("totalParkingSpaces: " + totalParkingSpaces);
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
                displaySpotHistory(parkingNumber);
            };
        })(i+1);
    }
}

async function displaySpotHistory(parkingNumber) {
    var historyElement = document.getElementById("history");
    fetch(apiBaseUrl + "/spot/history/" + parkingNumber)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            /*
            [
    {
        "id": 9,
        "entry_time": "2024-01-11T00:16:45",
        "departure_time": "2024-01-01T00:33:12",
        "reg_number": "EL-111a",
        "spot_id": 1
    },
    {
        "id": 1,
        "entry_time": "2024-01-01T00:10:45",
        "departure_time": "2024-01-01T00:33:12",
        "reg_number": "EL-111a",
        "spot_id": 1
    }
]
             */
            // max history records is 5
            var historyRecords = data.length;
            historyElement.innerHTML = "";
            for (var i = 0; i < historyRecords && i < maxHistoryRecords; i++) {
                historyElement.innerHTML += "<h4> Nr. rej: " + data[i]["reg_number"] + "</h4> " +
                    "<h4> Czas wjazdu: " + data[i]["entry_time"].replace("T", "      ") + "</h4> " +
                    "<h4> Czas wyjazdu: " + data[i]["departure_time"].replace("T", "      ") + "</h4> " + "<br>";
            }
        } )
}

function displaySpotDetails(parkingNumber) {
    var currentStatusElement = document.getElementById("currentStatus");
    fetch(apiBaseUrl + "/spot/info/" + parkingNumber)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            currentStatusElement.innerHTML = "<h4>Miejsce " + parkingNumber + "</h4>"
                                            + "<h4>Stan: " + (data["status"] == spotFree ? "Wolne" : "Zajęte") + "</h4>"
                                            + "<h4>Nr. rej: " + data["reg_number"] + "</h4>"
                                            + "<h4>Czas wjazdu: " + data["entry_time"].replace("T", "      ") + "\n" + "</h4>";
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