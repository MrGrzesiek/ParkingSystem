// Funkcja asynchroniczna do pobrania pliku JSON z nazwami zdjęć
async function pobierzNazwyZdjec() {
  try {
    const response = await fetch('../JSON/zdjecia.json'); // Zmienić ścieżkę do pliku JSON
    const data = await response.json();
    return data.zdjecia;
  } catch (error) {
    console.error('Błąd pobierania pliku JSON:', error);
    return [];
  }
}

// Funkcja asynchroniczna do losowania zdjęcia
async function losujZdjecie() {
  try {
    const zdjecia = await pobierzNazwyZdjec();
    const losoweZdjecie = zdjecia[Math.floor(Math.random() * zdjecia.length)];
    return losoweZdjecie;
  } catch (error) {
    console.error('Błąd losowania zdjęcia:', error);
    return null;
  }
}

// Funkcja do tworzenia nowej strony z kodem QR, numerem rejestracyjnym, czasem, numerem miejsca i zdjęciem
function createNewPageWithQRCode(numerRejestracyjny, czas, numerMiejsca, zdjecie) {
  // Utwórz nowe okno przeglądarki
  var newPage = window.open("", "_blank");

  // Utwórz zawartość dla nowej strony
  var content = document.createElement("div");
  content.innerHTML = "Numer rejestracyjny: " + numerRejestracyjny + "<br>Czas: " + czas.toLocaleString() + "<br>Numer miejsca: " + numerMiejsca+"<br>";

  // Utwórz element dla wylosowanego zdjęcia
  var imgElement = document.createElement("img");
  imgElement.src = "../RESOURCES/CAR PHOTO/" + zdjecie;  // Zmienić ścieżkę do folderu ze zdjęciami

  // Dodaj zdjęcie do zawartości
  content.appendChild(imgElement);

  newPage.document.body.appendChild(content);

  // Utwórz element dla kodu QR
  var br=document.createElement("br");
  newPage.document.body.appendChild(br);
  var qrCodeElement = newPage.document.createElement("div");
  qrCodeElement.id = "qrcode";
  newPage.document.body.appendChild(qrCodeElement);

  // Wygeneruj kod QR
  var qrcode = new QRCode(qrCodeElement, {
    text: "Numer rejestracyjny: " + numerRejestracyjny + "\nCzas: " + czas.toLocaleString() + "\nNumer miejsca: " + numerMiejsca,
    width: 128,
    height: 128,
  });
}

// Funkcja do obsługi przycisku "Enter"
function przyciskEnter() {
  var numerRejestracyjny = document.getElementById("tekstowe-pole").value;
  var rodzajOperacji;
  var radioButtons = document.getElementsByName("opcja");

  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      rodzajOperacji = radioButtons[i].value;
      break;
    }
  }

  var errorElement = document.querySelector(".error_message");
  var parkingStateElement = document.getElementById("parkin-state");

  // Symulacja danych o miejscach parkingowych
  var liczbaMiejsc = 50;  // całkowita liczba miejsc na parkingu
  var zajeteMiejsca = [10, 15, 20, 25];  // przykładowe zajęte miejsca

  // Oblicz ilość wolnych miejsc
  var wolneMiejsca = liczbaMiejsc - zajeteMiejsca.length;

  // Sprawdź, czy parking jest pełny
  if (wolneMiejsca > 0) {
    // Parking nie jest pełny - wykonaj standardową procedurę
    errorElement.textContent = "";

    if (numerRejestracyjny === "" || typeof rodzajOperacji === "undefined") {
      errorElement.textContent = "Wprowadź numer rejestracyjny i wybierz rodzaj operacji.";
    } else {
      console.log("Numer rejestracyjny: " + numerRejestracyjny + ", Rodzaj operacji: " + rodzajOperacji);

      var currentDate = new Date();
      console.log("Aktualna data i godzina: " + currentDate.toLocaleString());

      // Losuj numer miejsca parkingowego
      var numerMiejsca = Math.floor(Math.random() * liczbaMiejsc) + 1;

      // Losuj zdjęcie
      losujZdjecie().then(function (zdjecie) {
        // Utwórz nową stronę z zawartością, zdjęciem i kodem QR
        createNewPageWithQRCode(numerRejestracyjny, currentDate, numerMiejsca, zdjecie);
      });
    }
  } else {
    // Parking jest pełny - wyświetl komunikat
    errorElement.textContent = "Parking jest pełny. Brak wolnych miejsc.";
  }
}

// Funkcja do czyszczenia pola tekstowego
function czyscPole() {
  document.getElementById("tekstowe-pole").value = "";
}
// Skrypt cennika parkingu
document.addEventListener("DOMContentLoaded", function () {
  // Dane cennika
  var cennik = [
      { rodzaj: "Wjazd", cena: 5 },
      { rodzaj: "Pierwsza godzina parkowania", cena: 10 },
      { rodzaj: "Każda kolejna godzina parkowania", cena: 7 },
      { rodzaj: "Cała noc", cena: 50 },
  ];

  // Pobierz element, gdzie będziemy wyświetlać cennik
  var priceListElement = document.getElementById("price-list");

  // Wygeneruj HTML z danymi cennika
  var html = "<ul>";
  for (var i = 0; i < cennik.length; i++) {
      html += "<li>" + cennik[i].rodzaj + ": " + cennik[i].cena + " PLN</li>";
  }
  html += "</ul>";

  // Wyświetl cennik w elemencie price-list
  priceListElement.innerHTML = html;

  // Symulacja danych o miejscach parkingowych
  var liczbaMiejsc = 50;  // całkowita liczba miejsc na parkingu
  var zajeteMiejsca = 20;  // liczba zajętych miejsc
  
  // Oblicz ilość wolnych miejsc
  var wolneMiejsca = liczbaMiejsc - zajeteMiejsca;
  
  // Pobierz element, gdzie będziemy wyświetlać informacje o miejscach parkingowych
  var parkingStateElement = document.getElementById("parkin-state");
  
  // Wyświetl ilość wolnych miejsc
  parkingStateElement.textContent = "Stan parkingu: Wolne miejsca: " + wolneMiejsca;
});