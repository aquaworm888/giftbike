// Version 1
if (typeof Ecwid !== 'undefined') {
  console.log('Ecwid defined, initializing promo bar script');

  Ecwid.OnPageLoaded.add(async function(page) {
    console.log('Ecwid.OnPageLoaded triggered, page type:', page.type);
    const promoBarText = document.querySelector('.ec-promo-bar__text');
    if (promoBarText) {
      console.log('Promo Bar found');
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
        console.log('Promo Bar text unchanged:', promoBarText.innerText);
      }
    } else {
      console.log('Promo Bar not found');
    }
  });
} else {
  console.error('Ecwid is not defined');
}