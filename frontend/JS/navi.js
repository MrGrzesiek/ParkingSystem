async function createNavi() {

    const userLoggedIn = localStorage.getItem('user');
    const feedback = localStorage.getItem('feedback');
    
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
  
    if (true) {
      links.push(
        { href: '../HTML/chart.html', text: 'Wykres popularności', iconClass: 'bi-bar-chart-line-fill' },
        { href: '#', text: 'Zmiana stawek', iconClass: 'bi-currency-exchange' },
        { href: '../HTML/admin_log_panel.html', text: 'Wyloguj', iconClass: 'bi-box-arrow-in-left', id: 'logoutBtn' }
      );
    } else {
      links.push({ href: 'login.html', text: 'Zaloguj', iconClass: 'bi-box-arrow-in-left' });
    }
  
    links.forEach(linkData => {
      const link = document.createElement('a');
      link.href = linkData.href;
      link.classList.add('nav-item', 'nav-link');
  
      if (linkData.id === 'logoutBtn') {
        link.addEventListener('click', function() {
            localStorage.clear();
            window.location.href = 'index.html'; // Przejście do index.html po wylogowaniu
        });
      }
  
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
  
    
  document.addEventListener('DOMContentLoaded', async function() {
    const navElement = await createNavi(); // Oczekiwanie na zakończenie createNavi
  
    const navColorMainDiv = document.querySelector('.nav-color-main');
  
    if (navColorMainDiv) {
      navColorMainDiv.appendChild(navElement);
    } else {
      console.error('Nie znaleziono elementu o klasie nav-color-main');
    }
  });