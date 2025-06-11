if (typeof Ecwid !== 'undefined') {
  // Функция для установки и проверки cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Функция для получения страны по IP
  async function getCountryByIP() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.country_name || 'Unknown';
    } catch (error) {
      console.error('Error fetching country:', error);
      return 'Unknown';
    }
  }

  // Функция для отображения модального окна
  function showModal(storeLang, browserLang, country, isFirstVisit) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px';
    modal.style.border = '1px solid #ccc';
    modal.style.zIndex = '1000';
    modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    modal.innerHTML = `
      <p>Browser Language: ${browserLang}</p>
      <p>Store Language: ${storeLang}</p>
      <p>Country (by IP): ${country}</p>
      <p>Visit: ${isFirstVisit ? 'First Visit' : 'Returning Visit'}</p>
      <button onclick="this.parentElement.remove();">Close</button>
    `;
    document.body.appendChild(modal);
  }

  // Хук на загрузку страницы
  Ecwid.OnPageLoaded.add(async function(page) {
    // Получаем язык магазина
    const storeLang = Ecwid.getStorefrontLang() || 'Unknown';
    // Получаем язык браузера
    const browserLang = navigator.language || navigator.languages[0] || 'Unknown';
    // Получаем страну по IP
    const country = await getCountryByIP();
    // Проверяем, первый ли визит
    const isFirstVisit = !getCookie('firstVisit');
    if (isFirstVisit) {
      setCookie('firstVisit', 'true', 365); // Устанавливаем cookie на 1 год
    }

    // Показываем модальное окно
    showModal(storeLang, browserLang, country, isFirstVisit);
  });
}