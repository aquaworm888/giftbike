// Version 2
if (typeof Ecwid !== 'undefined') {
  console.log('Ecwid defined, initializing promo bar script');

  // Функция для изменения текста Promo Bar
  async function updatePromoBar() {
    const promoBarText = document.querySelector('.ins-tile__text p');
    if (promoBarText) {
      console.log('Promo Bar found, current text:', promoBarText.innerText);
      let country = localStorage.getItem('userCountry');
      if (!country) {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          country = data.country_name || 'Unknown';
          localStorage.setItem('userCountry', country);
          console.log('Country fetched:', country);
        } catch (error) {
          console.error('Error fetching country:', error);
          country = 'Unknown';
        }
      } else {
        console.log('Country from localStorage:', country);
      }

      if (country === 'Latvia') {
        promoBarText.innerText = 'Sveiki';
        console.log('Promo Bar text changed to "Sveiki"');
      } else {
        promoBarText.innerText = 'Hello!';
        console.log('Promo Bar text set to default:', promoBarText.innerText);
      }
    } else {
      console.log('Promo Bar not found');
    }
  }

  // Запуск через Ecwid.OnPageLoaded
  Ecwid.OnPageLoaded.add(function(page) {
    console.log('Ecwid.OnPageLoaded triggered, page type:', page.type);
    updatePromoBar();
  });

  // Запасной вариант через DOMContentLoaded с задержкой
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded triggered');
    setTimeout(() => {
      console.log('Delayed updatePromoBar call');
      updatePromoBar();
    }, 2000); // Задержка 2 секунды
  });
} else {
  console.error('Ecwid is not defined');
}