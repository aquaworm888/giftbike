// Version 10
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

  // Функция для фильтрации товаров по языку
  function filterProductsByLanguage(storeLang) {
    console.log('Filtering products for language:', storeLang);
    if (storeLang !== 'ru') {
      // Для en и lv показываем все товары
      const products = document.querySelectorAll('.ec-product, .grid-product');
      products.forEach(product => {
        product.style.display = '';
      });
      console.log('All products shown for language:', storeLang);
      return;
    }

    // Для ru скрываем товары, в названии которых нет "RU"
    const products = document.querySelectorAll('.ec-product, .grid-product');
    let visibleCount = 0;
    products.forEach(product => {
      const titleElement = product.querySelector('.ec-product__title, .grid-product__title');
      if (titleElement) {
        const title = titleElement.textContent.toUpperCase();
        if (title.includes('RU')) {
          product.style.display = '';
          visibleCount++;
        } else {
          product.style.display = 'none';
        }
      } else {
        console.warn('Product title element not found:', product);
        product.style.display = 'none';
      }
    });
    console.log(`Filtered products for ru: ${visibleCount} visible`);
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
      <p>Browser Language: ${browserLang}</p>
      <p>Store Language: ${storeLang}</p>
      <p>Country (by IP): ${country}</p>
      <p>Visit: ${isFirstVisit ? 'First Visit' : 'Returning Visit'}</p>
      <p>Version: 10</p>
      <div style="margin-top: 10px;">
        <button onclick="changeStoreLanguage('en')">English</button>
        <button onclick="changeStoreLanguage('ru')">Русский</button>
        <button onclick="changeStoreLanguage('lv')">Latviski</button>
      </div>
      <button style="margin-top: 10px;" onclick="this.parentElement.remove(); console.log('Close clicked');">Close</button>
    `;
    document.body.appendChild(modal);
  }

  // Функция для инициализации окна
  async function initModal() {
    console.log('initModal called, page:', window.location.href);
    try {
      let storeLang = Ecwid.getStorefrontLang?.() || null;
      console.log('Ecwid.getStorefrontLang result:', storeLang);
      
      if (!storeLang) {
        console.log('Falling back to URL for store language');
        storeLang = getLanguageFromUrl();
      }
      
      if (storeLang === 'Unknown') {
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
      // Применяем фильтрацию товаров
      filterProductsByLanguage(storeLang);
    } catch (error) {
      console.error('Error in initModal:', error);
      // Показываем окно с заглушкой
      let storeLang = getLanguageFromUrl();
      const browserLang = navigator.language || navigator.languages[0] || 'Unknown';
      const isFirstVisit = !getCookie('firstVisit');
      if (isFirstVisit) {
        setCookie('firstVisit', 'true', 365);
      }
      showModal(storeLang, browserLang, 'Unknown', isFirstVisit);
      filterProductsByLanguage(storeLang);
    }
  }

  // Пробуем запуск через Ecwid.OnAPILoaded
  Ecwid.OnAPILoaded.add(function() {
    console.log('Ecwid API loaded');
    Ecwid.OnPageLoaded.add(function(page) {
      console.log('Ecwid.OnPageLoaded triggered, page type:', page.type);
      if (page.type === 'SEARCH' || page.type === 'CATEGORY') {
        console.log('Filter parameters:', page.filterParams || 'None');
      }
      initModal();
    });
  });

  // Запасной вариант: запускаем через DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded triggered');
    if (typeof Ecwid !== 'undefined') {
      setTimeout(() => {
        initModal();
      }, 3000); // Задержка 3 секунды
    }
  });
}