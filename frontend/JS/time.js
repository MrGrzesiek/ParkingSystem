function aktualizujCzas() {
    var divCzas = document.getElementById('time');
    var teraz = new Date();
    var godzina = teraz.getHours();
    var minuta = teraz.getMinutes();
    var sekunda = teraz.getSeconds();

    // Dodaj zero przed liczbami mniejszymi niż 10
    godzina = godzina < 10 ? '0' + godzina : godzina;
    minuta = minuta < 10 ? '0' + minuta : minuta;
    sekunda = sekunda < 10 ? '0' + sekunda : sekunda;

    var czasTekst = godzina + ':' + minuta + ':' + sekunda;
    divCzas.textContent = czasTekst;
  }

  // Wywołaj funkcję aktualizującą czas_wjazdu co sekundę
  setInterval(aktualizujCzas, 1000);

  // Inicjalne ustawienie czasu
  aktualizujCzas();