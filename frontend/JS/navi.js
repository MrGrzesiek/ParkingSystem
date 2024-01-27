const api = 'http://localhost:8000';
async function createNavi() {

    const userLoggedIn = localStorage.getItem('login');
    
    const div = document.createElement('div');
    div.classList.add('nav-color-main');
  
    const nav = document.createElement('nav');
    nav.classList.add('navbar', 'navbar-expand-lg', 'navbar-light');
  
    const containerFluid = document.createElement('div');
    containerFluid.classList.add('container-fluid');
  
    const brandLink1 = document.createElement('a');
    brandLink1.classList.add('navbar-brand');
    brandLink1.href = '#';
  
    const brandLink2 = document.createElement('a');
    brandLink2.classList.add('navbar-brand', 'me-2');
    brandLink2.href = '../HTML/admin_panel.html';
  
    const img = document.createElement('img');
    img.src = '../RESOURCES/IMAGE/logo.png';
    img.height = '50';
    img.alt = 'Logo';
    img.loading = 'lazy';
    img.style.marginTop = '-1px';
  
    const togglerButton = document.createElement('button');
    togglerButton.type = 'button';
    togglerButton.classList.add('navbar-toggler');
    togglerButton.setAttribute('data-bs-toggle', 'collapse');
    togglerButton.setAttribute('data-bs-target', '#navbarCollapse');
  
    const togglerIcon = document.createElement('span');
    togglerIcon.classList.add('navbar-toggler-icon');
  
    const collapseDiv = document.createElement('div');
    collapseDiv.classList.add('collapse', 'navbar-collapse');
    collapseDiv.id = 'navbarCollapse';
  
    const navLinks = document.createElement('div');
    navLinks.classList.add('navbar-nav', 'ms-auto');
  
    const links = [];
  
    if (userLoggedIn) {
      links.push(
        { href: '../HTML/chart.html', text: 'Wykres popularności', iconClass: 'bi-bar-chart-line-fill' },
        { href: '#', text: 'Zmiana stawek', iconClass: 'bi-currency-exchange' },
        { href: '../HTML/admin_log_panel.html', text: 'Wyloguj', iconClass: 'bi-box-arrow-in-left', id: 'logoutBtn' }
      );
    } else {
      links.push({ href: '../HTML/admin_log_panel.html', text: 'Zaloguj', iconClass: 'bi-box-arrow-in-left' });
    }
  
    links.forEach(linkData => {
      const link = document.createElement('a');
      link.href = linkData.href;
      link.classList.add('nav-item', 'nav-link');
      if (linkData.text === 'Zmiana stawek') {
          link.setAttribute('data-bs-toggle', 'modal');
          link.setAttribute('data-bs-target', '#rateChangeModal');
      }

      if (linkData.id === 'logoutBtn') {
        link.addEventListener('click', function() {
            localStorage.clear();
            window.location.href = 'index.html'; // Przejście do index.html po wylogowaniu
        });
      };
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('bi', linkData.iconClass, 'icon-decoration');
  
      link.appendChild(iconSpan);
      link.appendChild(document.createTextNode(` ${linkData.text}`));
      navLinks.appendChild(link);
    });
  
    togglerButton.appendChild(togglerIcon);
    brandLink2.appendChild(img);
    containerFluid.append(brandLink1, brandLink2, togglerButton, collapseDiv);
    collapseDiv.appendChild(navLinks);
    nav.appendChild(containerFluid);
    div.appendChild(nav);

    return div;
  }

  function createModal() {
    return new Promise((resolve, reject) => {
        fetch(api + "/rates/all")
            .then(response => response.json())
            .then(data => {
                const modal = document.createElement('div');
                modal.classList.add('modal');
                modal.id = 'rateChangeModal';

                const modalDialog = document.createElement('div');
                modalDialog.classList.add('modal-dialog');

                const modalContent = document.createElement('div');
                modalContent.classList.add('modal-decoration');
                modalContent.classList.add('modal-content');

                const modalBody = document.createElement('div');
                modalBody.classList.add('modal-body');

                const inputFields = [
                    {label: 'Stawka godzinowa:         ', defaultValue: data.hourly_rate},
                    {label: 'Darmowe minuty po wjeździe:', defaultValue: data.entry_grace_minutes},
                    {label: 'Darmowe minuty do wyjazdu: ', defaultValue: data.exit_grace_minutes}];
                inputFields.forEach(field => {
                    const div = document.createElement('div');
                    div.classList.add('input-group', 'mb-2');

                    const span = document.createElement('span');
                    span.classList.add('input-group-text','modal-decoration');
                    span.textContent = field.label;

                    const input = document.createElement('input');
                    input.type = 'number';
                    input.value = field.defaultValue; // Set the default value
                    input.classList.add('form-control','modal-text');

                    div.append(span, input);
                    modalBody.appendChild(div);
                });

                const modalFooter = document.createElement('div');
                modalFooter.classList.add('modal-footer','modal-footer-decoration');

                // Dodaj pole modalerror
                const modalError = document.createElement('div');
                modalError.id = 'modalerror'; // Dodaj id modalerror
                modalError.textContent = ''; // Ustaw puste początkowe wartości
                modalFooter.appendChild(modalError);

                const cancelButton = document.createElement('button');
                cancelButton.type = 'button';
                cancelButton.classList.add('btn', 'btn-secondary');
                cancelButton.setAttribute('data-bs-dismiss', 'modal');
                cancelButton.textContent = 'Anuluj';

                const submitButton = document.createElement('button');
                submitButton.type = 'button';
                submitButton.classList.add('btn','button-decoration');
                submitButton.textContent = 'Zmień';
                submitButton.addEventListener('click', function() {
                    const inputElements = document.querySelectorAll('.input-group input');
                    const hourly_rate = inputElements[0].value;
                    const entry_grace_minutes = inputElements[1].value;
                    const exit_grace_minutes = inputElements[2].value;

                    fetch(api + `/rates/update/${hourly_rate}/${entry_grace_minutes}/${exit_grace_minutes}`, {
                        method: 'POST'
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            modalError.textContent = 'Stawki zostały zmienione.';
                        })
                        .catch(error => {
                            // Ustaw tekst błędu w polu modalerror
                            modalError.textContent = 'Wystąpił błąd podczas aktualizacji stawek.';
                            console.error('Error:', error);
                        });
                });
                modal.addEventListener('hidden.bs.modal', function () {
                  modalError.textContent = '';
                });

                modalFooter.append(cancelButton, submitButton);
                modalContent.append(modalBody, modalFooter);
                modalDialog.appendChild(modalContent);
                modal.appendChild(modalDialog);

                resolve(modal);
            })
            .catch(error => {
                // Reject the promise if there is an error
                reject(error);
            });
    });
}
    
  document.addEventListener('DOMContentLoaded', async function() {
    const navElement = await createNavi(); // Oczekiwanie na zakończenie createNavi
    const modalElement = await createModal();

    const navColorMainDiv = document.querySelector('.nav-color-main');
  
    if (navColorMainDiv) {
        navColorMainDiv.appendChild(navElement);
        navColorMainDiv.appendChild(modalElement);
    } else {
      console.error('Nie znaleziono elementu o klasie nav-color-main');
    }
  });