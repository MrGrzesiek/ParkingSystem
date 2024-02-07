/**
 * Funkcja aktualizująca wyświetlany czas co sekundę.
 */
function aktualizujCzas() {
  // Pobranie elementu div, gdzie będzie wyświetlany czas
  var divCzas = document.getElementById('time');
  
  // Pobranie aktualnej daty i godziny
  var teraz = new Date();
  var godzina = teraz.getHours();
  var minuta = teraz.getMinutes();
  var sekunda = teraz.getSeconds();

  // Dodanie zera przed liczbami mniejszymi niż 10
  godzina = godzina < 10 ? '0' + godzina : godzina;
  minuta = minuta < 10 ? '0' + minuta : minuta;
  sekunda = sekunda < 10 ? '0' + sekunda : sekunda;

  // Utworzenie tekstu z aktualnym czasem
  var czasTekst = godzina + ':' + minuta + ':' + sekunda;
  
  // Aktualizacja tekstu w divie czasu
  divCzas.textContent = czasTekst;
}

// Wywołanie funkcji aktualizującej czas co sekundę
setInterval(aktualizujCzas, 1000);

// Inicjalne ustawienie czasu
aktualizujCzas();
