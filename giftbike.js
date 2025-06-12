// Version 8
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

  // Функция для получения языка из URL
  function getLanguageFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/^\/(ru|lv)\//);
    return match ? match[1] : 'en';
  }

  // Функция для смены языка магазина через URL
  function changeStoreLanguage(lang) {
    console.log('Attempting to change language to:', lang);
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    let newPath;

    // Удаляем текущий язык из пути, если он есть (например, /ru/, /lv/)
    const cleanPath = currentPath.replace(/^\/(ru|lv)\//, '/');

    // Формируем новый путь
    if (lang === 'en') {
      newPath = cleanPath; // Для английского убираем /lang/
    } else {
      newPath = `/${lang}${cleanPath}`; // Добавляем /ru/ или /lv/
    }

    // Убедимся, что путь начинается с /
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath;
    }

    const newUrl = `https://gift.bike${newPath}${currentSearch}`;
    console.log(`Redirecting to: ${newUrl}`);
    window.location.href = newUrl;
  }

  // Функция для применения тестового фильтра
  function applyTestFilter() {
    console.log('Attempting to apply test filter: priceFrom=20');
    window.location.href = 'https://gift.bike/search?priceFrom=20';
  }

  // Функция для отображения модального окна
  function showModal(storeLang, browserLang, country, isFirstVisit) {
    if (document.querySelector('div[style*="position: fixed"]')) {
      console.log('Modal already exists, skipping');
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
    modal.style.borderRadius = '8px';
    modal.style.maxWidth = '400px';
    modal.innerHTML = `
      <span style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 20px;" onclick="this.parentElement.remove(); console.log('Close clicked');">✖</span>
      <p>Browser Language: ${browserLang}</p>
      <p>Store Language: ${storeLang}</p>
      <p>Country (by IP): ${country}</p>
      <p>Visit: ${isFirstVisit ? 'First Visit' : 'Returning Visit'}</p>
      <p>Version: 8</p>
      <div style="margin-top: 10px;">
        <button onclick="changeStoreLanguage('en')">English</button>
        <button onclick="changeStoreLanguage('ru')">Русский</button>
        <button onclick="changeStoreLanguage('lv')">Latviski</button>
        <button onclick="applyTestFilter()">Apply Test Filter</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Функция для инициализации окна
  async function initModal() {
    console.log('initModal called, page:', window.location.href);
    try {
      let storeLang = getLanguageFromUrl();
      const browserLang = navigator.language || navigator.languages[0] || 'Unknown';
      const isFirstVisit = !getCookie('firstVisit');
      if (isFirstVisit) {
        setCookie('firstVisit', 'true', 365);
      }
      const country = await getCountryByIP();
      showModal(storeLang, browserLang, country, isFirstVisit);
    } catch (error) {
      console.error('Error in initModal:', error);
      // Показываем окно с заглушкой, если ошибка
      const storeLang = getLanguageFromUrl();
      const browserLang = navigator.language || navigator.languages[0] || 'Unknown';
      const isFirstVisit = !getCookie('firstVisit');
      if (isFirstVisit) {
        setCookie('firstVisit', 'true', 365);
      }
      showModal(storeLang, browserLang, 'Unknown', isFirstVisit);
    }
  }

  // Запускаем через DOMContentLoaded с задержкой
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded triggered');
    setTimeout(() => {
      initModal();
    }, 3000); // Задержка 3 секунды для совместимости с Ecwid
  });
}