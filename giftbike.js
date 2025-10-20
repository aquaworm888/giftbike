// Version 3
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

  // Функция для получения языка магазина через API
  async function getStoreLanguage() {
    try {
      // Замените <YOUR_PUBLIC_TOKEN> на ваш публичный токен
      const response = await fetch('https://app.ecwid.com/api/v3/110610642/profile?token=public_<YOUR_PUBLIC_TOKEN>', {
        headers: {
          'Authorization': 'Bearer custom-app-110610642-1'
        }
      });
      const data = await response.json();
      return data.language || 'Unknown';
    } catch (error) {
      console.error('Error fetching store language:', error);
      return 'Unknown';
    }
  }

  // Функция для смены языка магазина
  function changeStoreLanguage(lang) {
    if (Ecwid.setStorefrontLang) {
      Ecwid.setStorefrontLang(lang);
      console.log(`Language changed to: ${lang}`);
      window.location.reload(); // Перезагружаем страницу для применения изменений
    } else {
      console.error('Ecwid.setStorefrontLang is not available');
    }
  }

  // Функция для отображения модального окна
  function showModal(storeLang, browserLang, country, isFirstVisit) {
    // Проверяем, не отображено ли окно уже
    if (document.querySelector('div[style*="position: fixed"]')) {
      return;
    }
    console.log('Showing modal with:', { storeLang, browserLang, country, isFirstVisit });
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
      <div style="margin-top: 10px;">
        <button onclick="changeStoreLanguage('en')">English</button>
        <button onclick="changeStoreLanguage('ru')">Русский</button>
        <button onclick="changeStoreLanguage('lv')">Latviski</button>
      </div>
      <button style="margin-top: 10px;" onclick="this.parentElement.remove();">Close</button>
    `;
    document.body.appendChild(modal);
  }

  // Функция для инициализации окна
  async function initModal() {
    console.log('initModal called, page:', window.location.href);
    // Пробуем получить язык через Ecwid.getStorefrontLang
    let storeLang = Ecwid.getStorefrontLang?.() || null;
    console.log('Ecwid.getStorefrontLang result:', storeLang);
    
    // Если getStorefrontLang не сработал, пробуем API
    if (!storeLang) {
      console.log('Falling back to API for store language');
      storeLang = await getStoreLanguage();
    }
    
    const browserLang = navigator.language || navigator.languages[0] || 'Unknown';
    const isFirstVisit = !getCookie('firstVisit');
    if (isFirstVisit) {
      setCookie('firstVisit', 'true', 365);
    }
    const country = await getCountryByIP();
    showModal(storeLang, browserLang, country, isFirstVisit);
  }

  // Пробуем запуск через Ecwid.OnAPILoaded
  Ecwid.OnAPILoaded.add(function() {
    console.log('Ecwid API loaded');
    Ecwid.OnPageLoaded.add(function(page) {
      console.log('Ecwid.OnPageLoaded triggered, page type:', page.type);
      initModal();
    });
  });

  // Запасной вариант: запускаем через DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded triggered');
    if (typeof Ecwid !== 'undefined') {
      // Дополнительная задержка для главной страницы
      setTimeout(() => {
        initModal();
      }, 1000); // Ждём 1 секунду, чтобы Ecwid SDK успел загрузиться
    }
  });
}