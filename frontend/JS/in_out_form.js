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
function createTicket(numerRejestracyjny, czas, numerMiejsca, zdjecie) {
  // Utwórz nowe okno przeglądarki
  var newPage = window.open("", "_blank");

  // Utwórz zawartość dla nowej strony
  var content = document.createElement("div");
  content.style.textAlign = "center"; // Wyśrodkuj tekst w poziomie
  content.style.margin = "auto"; // Wyśrodkuj w poziomie
  content.style.maxWidth = "500px"; // Ogranicz szerokość zawartości
  content.style.border = "2px solid grey";
  content.style.padding = "20px";

  // Pobierz czas w formacie Unix Timestamp
  var unixTimestamp = Math.floor(czas.getTime() / 1000);

  content.innerHTML = `
    <head>
      <title>Bilet</title>
      <link rel="icon" href="../RESOURCES/IMAGE/icon.png" type="image/x-icon">
    </head>
    <h1 class="mb-4">SMART PARK</h2>
    <h2 class="mb-4">Bilet</h2>
    <p>Numer rejestracyjny: ${numerRejestracyjny}</p>
    <p>Czas wjazdu: ${czas.toLocaleString()}</p>
    <p>Numer miejsca: ${numerMiejsca}</p>
    <img src="../RESOURCES/CAR PHOTO/${zdjecie}" style="max-width: 100%; height: auto; margin-bottom: 20px;" class="mb-4" alt="Car Photo">  <!-- Dodaj styl do responsywnego obrazu i marginesu -->
    <br>
    <div id="qrcode" style="display: flex; justify-content: center;" class="mb-4"></div>
    <br>
    <a href="${generateLink(numerRejestracyjny, unixTimestamp)}">Aktualna oplata</a>
  `;

  // Utwórz element dla kodu QR
  var qrCodeElement = content.querySelector("#qrcode");

  // Wygeneruj kod QR z linkiem
  var qrcode = new QRCode(qrCodeElement, {
    text: "Nr rej. : " + numerRejestracyjny + "\nCzas: " + unixTimestamp + "\nNumer miejsca: " + numerMiejsca + "\nLink: " + generateLink(numerRejestracyjny, unixTimestamp),
    width: 128,
    height: 128,
  });

  // Dodaj stylowanie dla strony
  var style = newPage.document.createElement("style");
  style.innerHTML = `
    body {
      background-color: #f0f0f0; /* Kolor tła strony */
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: 'receipt';
    }
    @font-face {
      font-family: 'receipt';
      src: url('../RESOURCES/FONT/receipt.ttf') format('truetype');
    }
  `;
  newPage.document.head.appendChild(style);

  // Dodaj zawartość do nowej strony
  newPage.document.body.appendChild(content);
}
// Funkcja do generowania linku
function generateLink(numerRejestracyjny, czas) {
  // Tutaj możesz dostosować format linku zgodnie z własnymi preferencjami
  return "http://localhost:7999/HTML/howmanycash.html?nr_rej=" + numerRejestracyjny + "&czas=" + czas;
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
  console.log("rodzajOperacji: "+rodzajOperacji);
  switch(rodzajOperacji){
    case "in":
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
            createTicket(numerRejestracyjny, currentDate, numerMiejsca, zdjecie);
          });
        }
      } else {
        // Parking jest pełny - wyświetl komunikat
        errorElement.textContent = "Parking jest pełny. Brak wolnych miejsc.";
      }
      break;
    case "out":
      czas=1706017455;
      var czas_wyjazdu = new Date();
      oplata=10;
      if (numerRejestracyjny === "" || typeof rodzajOperacji === "undefined") {
        errorElement.textContent = "Wprowadź numer rejestracyjny i wybierz rodzaj operacji.";
      } else {
        const czasPostoju = obliczCzasPostoju(1706017455);
        console.log(`Czas postoju: ${czasPostoju.godziny} godzin i ${czasPostoju.minuty} minut`);
        createRecipe(numerRejestracyjny, czas,czas_wyjazdu, numerMiejsca,oplata)
      }
      break;
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
function obliczCzasPostoju(czasUnix) {
  const teraz = new Date();
  const czasPostojuMillis = teraz.getTime() - czasUnix * 1000; // Konwersja sekund na milisekundy
  const czasPostojuMinuty = Math.floor(czasPostojuMillis / (1000 * 60));
  const godziny = Math.floor(czasPostojuMinuty / 60);
  const minuty = czasPostojuMinuty % 60;

  return { godziny, minuty };
}
function createRecipe(numerRejestracyjny, czas,czas_wyjazdu, numerMiejsca,oplata) {
  // Utwórz nowe okno przeglądarki
  var newPage = window.open("", "_blank");

  // Utwórz zawartość dla nowej strony
  var content = document.createElement("div");
  content.style.textAlign = "center"; // Wyśrodkuj tekst w poziomie
  content.style.margin = "auto"; // Wyśrodkuj w poziomie
  content.style.maxWidth = "500px"; // Ogranicz szerokość zawartości
  content.style.border = "2px solid grey";
  content.style.padding = "20px";

  content.innerHTML = `
    <head>
      <title>Rachunek</title>
      <link rel="icon" href="../RESOURCES/IMAGE/icon.png" type="image/x-icon">
    </head>
    <h1 class="mb-4">SMART PARK</h2>
    <h2 class="mb-4">Rachunek</h2>
    <p>Numer rejestracyjny: ${numerRejestracyjny}</p>
    <p>Czas wjazdu: ${new Date(czas * 1000).toLocaleString()}</p>
    <p>Czas wyjazdu: ${czas_wyjazdu.toLocaleString()}</p>
    <p>Numer miejsca: ${numerMiejsca}</p>
    <br>
    <h2>Naleznosc: ${oplata} PLN</h2>
    <br>
    <p>DZIEKUJEMU ZA WIZYTE</p>
    <p>ZAPRASZAMY PONOWNIE<p>
  `;

  // Dodaj stylowanie dla strony
  var style = newPage.document.createElement("style");
  style.innerHTML = `
    body {
      background-color: #f0f0f0; /* Kolor tła strony */
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: 'receipt';
    }
    @font-face {
      font-family: 'receipt';
      src: url('../RESOURCES/FONT/receipt.ttf') format('truetype');
    }
  `;
  newPage.document.head.appendChild(style);

  // Dodaj zawartość do nowej strony
  newPage.document.body.appendChild(content);
}