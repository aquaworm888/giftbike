// Version 3 - Using Ecwid.getVisitorLocation()
if (typeof Ecwid !== 'undefined') {
  console.log('Ecwid defined, initializing promo bar script with Ecwid API');

  // Функция для изменения текста Promo Bar
  function updatePromoBar() {
    const promoBarText = document.querySelector('.ins-tile__text p');
    if (promoBarText) {
      console.log('Promo Bar found, current text:', promoBarText.innerText);
      const location = Ecwid.getVisitorLocation();
      console.log('Visitor location:', location);
      if (location && location.countryCode === 'LV') {
        promoBarText.innerText = 'Sveiki';
        console.log('Promo Bar text changed to "Sveiki" (Latvia detected)');
      } else {
        promoBarText.innerText = 'Hello!';
        console.log('Promo Bar text set to default (non-Latvia)');
      }
    } else {
      console.log('Promo Bar not found');
    }
  }

  // Ждём загрузки Ecwid API
  Ecwid.OnAPILoaded.add(function() {
    console.log('Ecwid API loaded');
    Ecwid.OnPageLoaded.add(function(page) {
      console.log('Ecwid.OnPageLoaded triggered, page type:', page.type);
      updatePromoBar();
    });
  });

  // Запасной вариант через DOMContentLoaded с задержкой
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded triggered');
    setTimeout(() => {
      console.log('Delayed updatePromoBar call');
      if (typeof Ecwid !== 'undefined' && Ecwid.getVisitorLocation) {
        updatePromoBar();
      } else {
        console.log('Ecwid or getVisitorLocation not ready yet');
      }
    }, 2000); // Задержка 2 секунды
  });
} else {
  console.error('Ecwid is not defined');
}