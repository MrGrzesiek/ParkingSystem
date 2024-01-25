const apiBaseUrl = 'http://localhost:8000';

document.addEventListener("DOMContentLoaded", async function() {
    // Stan parkingu (liczba dostępnych miejsc)
    var totalParkingSpaces = 10;
    var occupiedParkingSpaces = 3;
    await renderParkingMap();

    // Obliczanie dostępnych miejsc
    var availableParkingSpaces = calculateParkingStatus(totalParkingSpaces, occupiedParkingSpaces);

    // Wyświetlanie stanu parkingu
    displayParkingStatus(availableParkingSpaces, totalParkingSpaces);
    
});

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
                displayParkingNumber(parkingNumber);
            };
        })(i+1);
    }
}
function displayParkingNumber(parkingNumber) {
    var currentStatusElement = document.getElementById("currentStatus");
    var historyElement = document.getElementById("history");
    currentStatusElement.textContent = "Clicked on Parking Space " + parkingNumber;
    historyElement.textContent = "Clicked on Parking Space " + parkingNumber;
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
    console.log('Wywołanie funkcji co 5 sekund');
  }, 1000);