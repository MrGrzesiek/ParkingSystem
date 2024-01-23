document.addEventListener("DOMContentLoaded", function() {
    // Stan parkingu (liczba dostępnych miejsc)
    var totalParkingSpaces = 10;
    var occupiedParkingSpaces = 3;
    var parkingStates = generateParkingStates(50);

    generateParkingSpaces(parkingStates);

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

function generateParkingStates(numSpaces) {
    var parkingStates = [];
    for (var i = 0; i < numSpaces; i++) {
        parkingStates.push(Math.floor(Math.random() * 2));
    }
    return parkingStates;
}

function generateParkingSpaces(states) {
    var container = document.getElementById('parkingMap');

    for (var i = 0; i < states.length; i++) {
        var parkingSpace = document.createElement('div');
        parkingSpace.className = 'col';

        var parkingSpaceContent = document.createElement('div');
        parkingSpaceContent.className = 'parking-space text-center';
        parkingSpaceContent.textContent = i + 1;

        // Sprawdzanie stanu i ustawianie koloru tła odpowiednio
        if (states[i] === 1) {
            parkingSpaceContent.classList.add('occupied');
        } else {
            parkingSpaceContent.classList.add('available');
        }

        (function (parkingNumber) {
            parkingSpaceContent.onclick = function() {
                displayParkingNumber(parkingNumber);
            };
        })(i+1);

        parkingSpace.appendChild(parkingSpaceContent);
        container.appendChild(parkingSpace);
    }
}
function displayParkingNumber(parkingNumber) {
    var currentStatusElement = document.getElementById("currentStatus");
    var historyElement = document.getElementById("history");
    currentStatusElement.textContent = "Clicked on Parking Space " + parkingNumber;
    historyElement.textContent = "Clicked on Parking Space " + parkingNumber;
}