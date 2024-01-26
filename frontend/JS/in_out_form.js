const apiBaseUrl = 'http://localhost:8000';

async function pobierzNazwyZdjec() {
  try {
    const response = await fetch('../JSON/zdjecia.json');
    const data = await response.json();
    return data.zdjecia;
  } catch (error) {
    console.error('Błąd pobierania pliku JSON:', error);
    return [];
  }
}

async function losujZdjecie() {
  try {
    const zdjecia = await pobierzNazwyZdjec();
    const losoweZdjecie = zdjecia[Math.floor(Math.random() * zdjecia.length)];
    console.log("photo: ",losoweZdjecie);
    return losoweZdjecie;
  } catch (error) {
    console.error('Błąd losowania zdjęcia:', error);
    return null;
  }
}

function createTicket(numerRejestracyjny, czas, numerMiejsca, zdjecie) {

  var newPage = window.open("", "_blank");

  var content = document.createElement("div");
  content.style.textAlign = "center";
  content.style.margin = "auto"; 
  content.style.maxWidth = "500px";
  content.style.border = "2px solid grey";
  content.style.padding = "20px";

  czas_unix = Math.floor(new Date(czas).getTime() / 1000);
  console.log("Czas UNIX:", czas_unix);
  const fullDate = new Date(czas_unix * 1000);
  const normalDate = formatDate(fullDate);
  console.log("Czas", normalDate.toLocaleString());

  const currentTimezoneOffset = new Date().getTimezoneOffset();
  console.log("Przesunięcie czasowe aktualnej strefy czasowej w minutach:", currentTimezoneOffset);

  content.innerHTML = `
    <head>
      <title>Bilet</title>
      <link rel="icon" href="../RESOURCES/IMAGE/icon.png" type="image/x-icon">
    </head>
    <h1 class="mb-4">SMART PARK</h2>
    <h2 class="mb-4">Bilet</h2>
    <p>Numer rejestracyjny: ${numerRejestracyjny}</p>
    <p>Czas wjazdu: ${normalDate}</p>
    <p>Numer miejsca: ${numerMiejsca}</p>
    <img src="../RESOURCES/CAR PHOTO/${zdjecie}" style="max-width: 100%; height: auto; margin-bottom: 20px;" class="mb-4" alt="Car Photo">  <!-- Dodaj styl do responsywnego obrazu i marginesu -->
    <br>
    <div id="qrcode" style="display: flex; justify-content: center;" class="mb-4"></div>
    <br>
    <a href="${generateLink(numerRejestracyjny, czas_unix)}">Aktualna oplata</a>
  `;
  // Utwórz element dla kodu QR
  var qrCodeElement = content.querySelector("#qrcode");
  // Wygeneruj kod QR z linkiem
  var qrcode = new QRCode(qrCodeElement, {
    text: "Nr rej. : " + numerRejestracyjny + "\nCzas: " + normalDate + "\nNumer miejsca: " + numerMiejsca + "\nLink: " + generateLink(numerRejestracyjny, czas_unix),
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
  console.log("link dziala");
  return "http://localhost:7999/HTML/howmuchcash.html?nr_rej=" + numerRejestracyjny + "&czas=" + czas;
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
          sendCarToParking(numerRejestracyjny,zdjecie)
          .then(result => {
            var id = result[0];
            var entryTime = result[1][0].entry_time;
            console.log("ID:", id);
            console.log(typeof(id));
            console.log("Entry Time:", entryTime.toLocaleString());
            console.log(typeof(entryTime));
            createTicket(numerRejestracyjny, entryTime, id, zdjecie);

            // Tutaj możesz przetwarzać dane zwrócone przez funkcję sendCarToParking
          })
          .catch(error => {
            generateError(errorElement,"Auto o takim numerze jest już na parkingu.")
            console.error(error);
          });

            // Utwórz nową stronę z zawartością, zdjęciem i kodem QR
            //createTicket(numerRejestracyjny, currentDate, numerMiejsca, zdjecie);
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
refreshData();
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
    <p>DZIEKUJEMY ZA WIZYTE</p>
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
async function sendCarToParking(regNumber, photo) {
  try {
    const response = await fetch(apiBaseUrl + "/spot/reserve/" + regNumber + "/" + photo);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
function generateError(element,message){
  element.textContent=message;
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function refreshData(){
  getPrice();
  getParkingStatus();
}
function getParkingStatus(){
  fetch(apiBaseUrl + "/spot/number_of_free_out_of_all") // returns two numbers: number of free spots and number of all spots
  .then(response => response.json())
  .then(data => {
      //console.log(data)
      occupiedParkingSpaces = data[0][0]["COUNT(status)"];
      totalParkingSpaces = data[1][0]["COUNT(status)"];
      //console.log("occupiedParkingSpaces: " + occupiedParkingSpaces);
      //console.log("totalParkingSpaces: " + totalParkingSpaces);
      // Wyświetlanie stanu parkingu
      displayParkingStatus(occupiedParkingSpaces, totalParkingSpaces);
  } )
}
function getPrice(){
  var priceElement = document.getElementById("price-list");
  fetch(apiBaseUrl + "/rates/all")
  .then(response => response.json())
  .then(data => {
      console.log(data)
    /* {
  "hourly_rate": 2,
  "entry_grace_minutes": 15,
  "exit_grace_minutes": 15
} */
    var html = "<ul>";
      html += "<li>" + "Stawka godzinowa: " + data.hourly_rate + " PLN</li><br>";
      html += "<li>" + "Czas darmowy na wjeździe: " + data.entry_grace_minutes + " minut</li><br>";
      html += "<li>" + "Czas darmowy na wyjeździe: " + data.exit_grace_minutes + " minut</li>";
      html += "</ul>";
      // make list elements vertical
      priceElement.innerHTML = html;

  } )
}
function displayParkingStatus(availableSpaces, totalSpaces) {
  var parkingStatusElement = document.getElementById("parkin-state");
  if(availableSpaces>0)
      parkingStatusElement.innerHTML = "Stan parkingu: "+(50-availableSpaces) + " / " + totalSpaces;
  else
      parkingStatusElement.innerHTML = "Parking pełny";
}
setInterval(() => {
  refreshData();
  //console.log('Wywołanie funkcji co 5 sekund');
}, 1000);