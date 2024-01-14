function czyscPole() {
    document.getElementById('tekstowe-pole').value = '';
  }

  function przyciskEnter() {
    var tekst = document.getElementById('tekstowe-pole').value;
    // Tutaj możesz dodać kod obsługi wciśnięcia Enter
    console.log('Wciśnięto Enter z tekstem: ' + tekst);
  }