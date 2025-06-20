// Version 13
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
      const response = await fetch('https://ip-api.com/json/');
      const data = await response.json();
      return data.country || 'Unknown';
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
      // Замените <YOUR_PUBLIC_TOKEN> на публичный токен
      const response = await fetch('https://app.ecwid.com/api/v3/110610642/profile?token=public_YMDbBQxMR1LxxYR1Gqn1vwbC2bBFCQ1n', {
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

  // Функция для применения фильтра языка в URL
  function applyLanguageFilter(lang, currentPath, currentSearch, pageType) {
    console.log('Applying language filter for:', lang, 'Path:', currentPath, 'Search:', currentSearch, 'PageType:', pageType);
    let newPath = currentPath;
    let newSearch = currentSearch;

    // Удаляем текущий язык из пути, если он есть
    const cleanPath = currentPath.replace(/^\/(ru|lv)\//, '/');

    // Формируем новый путь
    if (lang === 'en') {
      newPath = cleanPath;
    } else {
      newPath = `/${lang}${cleanPath}`;
    }

    // Убедимся, что путь начинается с /
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath;
    }

    // Применяем фильтр только для страниц каталога
    if (lang === 'ru' && (pageType === 'CATEGORY' || pageType === 'SEARCH')) {
      const params = new URLSearchParams(currentSearch);
      params.set('attribute_Design+language', 'Russian,Without+captions');
      newSearch = '?' + params.toString();
    } else {
      // Удаляем фильтр для других языков или не-каталожных страниц
      const params = new URLSearchParams(currentSearch);
      params.delete('attribute_Design+language');
      newSearch = params.toString() ? '?' + params.toString() : '';
    }

    const newUrl = `https://gift.bike${newPath}${newSearch}`;
    console.log(`Generated URL: ${newUrl}`);
    return newUrl;
  }

  // Функция для смены языка магазина через URL
  function changeStoreLanguage(lang) {
    console.log('Attempting to change language to:', lang);
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    // Определяем тип страницы
    const pageType = Ecwid.getCurrentPage?.()?.type || 'UNKNOWN';
    const newUrl = applyLanguageFilter(lang, currentPath, currentSearch, pageType);
    // Сохраняем выбранный язык
    setCookie('selectedLanguage', lang, 365);
    console.log(`Redirecting to: ${newUrl}`);
    window.location.href = newUrl;
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
      <p>Version: 13</p>
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
      // Проверяем первое посещение
      const isFirstVisit = !getCookie('firstVisit');
      if (!isFirstVisit) {
        console.log('Not first visit, skipping modal');
        // Применяем фильтр, если на каталожной странице
        const storeLang = getLanguageFromUrl();
        const pageType = Ecwid.getCurrentPage?.()?.type || 'UNKNOWN';
        if (storeLang === 'ru' && (pageType === 'CATEGORY' || pageType === 'SEARCH')) {
          const currentPath = window.location.pathname;
          const currentSearch = window.location.search;
          const newUrl = applyLanguageFilter(storeLang, currentPath, currentSearch, pageType);
          if (newUrl !== window.location.href) {
            console.log(`Applying filter on page load, redirecting to: ${newUrl}`);
            window.location.href = newUrl;
          }
        }
        return;
      }

      // Получаем данные
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
      const country = await getCountryByIP();

      // Проверяем условия для отображения окна
      if (country !== 'Latvia' || !browserLang.startsWith('en')) {
        console.log('Conditions not met for modal:', { country, browserLang });
        setCookie('firstVisit', 'true', 365);
        // Применяем фильтр, если на каталожной странице
        if (storeLang === 'ru' && (Ecwid.getCurrentPage?.()?.type === 'CATEGORY' || Ecwid.getCurrentPage?.()?.type === 'SEARCH')) {
          const currentPath = window.location.pathname;
          const currentSearch = window.location.search;
          const newUrl = applyLanguageFilter(storeLang, currentPath, currentSearch, Ecwid.getCurrentPage?.()?.type || 'UNKNOWN');
          if (newUrl !== window.location.href) {
            console.log(`Applying filter on page load, redirecting to: ${newUrl}`);
            window.location.href = newUrl;
          }
        }
        return;
      }

      // Показываем окно и устанавливаем cookie
      setCookie('firstVisit', 'true', 365);
      showModal(storeLang, browserLang, country, isFirstVisit);
    } catch (error) {
      console.error('Error in initModal:', error);
      // Показываем окно с заглушкой, если условия выполнены
      const isFirstVisit = !getCookie('firstVisit');
      if (!isFirstVisit) {
        console.log('Not first visit, skipping modal');
        return;
      }
      const storeLang = getLanguageFromUrl();
      const browserLang = navigator.language || navigator.languages[0] || 'Unknown';
      const country = 'Unknown';
      if (country !== 'Latvia' || !browserLang.startsWith('en')) {
        console.log('Conditions not met for modal:', { country, browserLang });
        setCookie('firstVisit', 'true', 365);
        return;
      }
      setCookie('firstVisit', 'true', 365);
      showModal(storeLang, browserLang, country, isFirstVisit);
    }
  }

  // Пробуем запуск через Ecwid.OnAPILoaded
  Ecwid.OnAPILoaded.add(function() {
    console.log('Ecwid API loaded');
    Ecwid.OnPageLoaded.add(function(page) {
      console.log('Ecwid.OnPageLoaded triggered, page type:', page.type);
      if (page.type === 'SEARCH' || page.type === 'CATEGORY') {
        console.log('Filter parameters:', page.filterParams || 'None');
        // Применяем фильтр для ru на каталожных страницах
        const storeLang = getLanguageFromUrl();
        if (storeLang === 'ru') {
          const currentPath = window.location.pathname;
          const currentSearch = window.location.search;
          const newUrl = applyLanguageFilter(storeLang, currentPath, currentSearch, page.type);
          if (newUrl !== window.location.href) {
            console.log(`Applying filter on page change, redirecting to: ${newUrl}`);
            window.location.href = newUrl;
          }
        }
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