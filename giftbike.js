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
    // Проверяем, не отображено ли окно уже
    if (document.querySelector('div[style*="position: fixed"]')) {
      return;
    }
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

  // Функция для инициализации окна
  async function initModal() {
    console.log('initModal called, page:', window.location.href); // Отладка
    const storeLang = Ecwid.getStorefrontLang?.() || 'Unknown';
    const browserLang = navigator.language || navigator.languages[0] || 'Unknown';
    const isFirstVisit = !getCookie('firstVisit');
    if (isFirstVisit) {
      setCookie('firstVisit', 'true', 365);
    }
    const country = await getCountryByIP();
    showModal(storeLang, browserLang, country, isFirstVisit);
  }

  // Пробуем запуск через Ecwid.OnPageLoaded
  Ecwid.OnPageLoaded.add(function(page) {
    console.log('Ecwid.OnPageLoaded triggered, page type:', page.type); // Отладка
    initModal();
  });

  // Запасной вариант: запускаем через DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded triggered'); // Отладка
    if (typeof Ecwid !== 'undefined') {
      initModal();
    }
  });
}