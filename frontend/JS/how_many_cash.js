async function main() {
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var dataContainer = document.getElementById("data");
  // Odczytaj parametry z adresu URL
  var numerRejestracyjny = getParameterByName('nr_rej');
  var czasWjazdu = parseInt(getParameterByName('czas')); // Parsuj czas jako liczbę całkowitą

  // Oblicz czas postoju
  var czasPostoju = await obliczCzasPostoju(czasWjazdu);

  // Utwórz elementy HTML dynamicznie
  var numerRejestracyjnyElement = document.createElement("p");
  numerRejestracyjnyElement.classList.add("mb-4");
  numerRejestracyjnyElement.textContent = "Numer rejestracyjny: " + numerRejestracyjny;

  var czasWjazduElement = document.createElement("p");
  czasWjazduElement.textContent = "Czas wjazdu: " + new Date(czasWjazdu * 1000).toLocaleString();

  var czasPostojuElement = document.createElement("p");
  czasPostojuElement.textContent = "Czas postoju: " + czasPostoju.godziny + " godzin i " + czasPostoju.minuty + " minut";

  // Dodaj elementy do dokumentu
  dataContainer.appendChild(numerRejestracyjnyElement);
  dataContainer.appendChild(czasWjazduElement);
  dataContainer.appendChild(czasPostojuElement);
}

// Wywołaj funkcję główną
main();
function obliczCzasPostoju(czasUnix) {
  const teraz = new Date();
  const czasPostojuMillis = teraz.getTime() - czasUnix * 1000; // Konwersja sekund na milisekundy
  const czasPostojuMinuty = Math.floor(czasPostojuMillis / (1000 * 60));
  const godziny = Math.floor(czasPostojuMinuty / 60);
  const minuty = czasPostojuMinuty % 60;

  return { godziny, minuty };
}