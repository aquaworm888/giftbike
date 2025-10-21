// Version 27
if (typeof Ecwid !== 'undefined') {
  console.log('Ecwid defined, initializing script');

  // Функция для установки и проверки cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    console.log(`Set cookie: ${name}=${value}`);
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    console.log(`Get cookie: ${name}=null`);
    return null;
  }

  // Функция для смены языка через URL
  function changeLanguage(lang) {
    console.log('Attempting to change language to:', lang);
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    let newPath;

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

    const newUrl = `https://gift.bike${newPath}${currentSearch}`;
    console.log(`Redirecting to: ${newUrl}`);
    setCookie('firstVisit', 'true', 365);
    window.location.href = newUrl;
  }

  // Функция для отображения модального окна
  function showModal() {
    if (!document.body) {
      console.error('document.body is not available');
      return;
    }
    if (document.querySelector('div[style*="position: fixed"]')) {
      console.log('Modal already exists, skipping');
      return;
    }
    console.log('Showing modal');
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
      <span class="close" onclick="this.parentElement.remove(); setCookie('firstVisit', 'true', 365); console.log('Close clicked');">&times;</span>
      <p style="margin-top: 20px;">Please choose your language for product designs and interface.</p>
      <div class="language-buttons">
        <button onclick="changeLanguage('en')">English</button>
        <button onclick="changeLanguage('ru')">Русский</button>
        <button onclick="changeLanguage('lv')">Latviski</button>
      </div>
      <p class="cookie-notice">By continuing to use this site, you agree to our use of cookies. Learn more in our <a href="https://gift.bike/products/pages/privacy-policy" target="_blank">Privacy Policy</a>.</p>
      <div class="center-close">
        <button onclick="this.parentElement.parentElement.remove(); setCookie('firstVisit', 'true', 365); console.log('Close clicked');">I don't care</button>
      </div>
    `;
    document.body.appendChild(modal);
    console.log('Modal appended to body');
  }

  // Функция для инициализации окна
  function initModal() {
    console.log('initModal called, page:', window.location.href);
    try {
      const isFirstVisit = !getCookie('firstVisit');
      console.log('isFirstVisit:', isFirstVisit);
      if (isFirstVisit) {
        showModal();
      } else {
        console.log('Not first visit, skipping modal');
      }
    } catch (error) {
      console.error('Error in initModal:', error);
    }
  }

  // Пробуем запуск через Ecwid.OnPageLoaded
  Ecwid.OnPageLoaded.add(function(page) {
    console.log('Ecwid.OnPageLoaded triggered, page type:', page.type);
    initModal();
  });

  // Запасной вариант: запускаем через DOMContentLoaded с увеличенной задержкой
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded triggered');
    setTimeout(() => {
      console.log('Delayed initModal call');
      initModal();
    }, 5000); // Задержка 5 секунд
  });
} else {
  console.error('Ecwid is not defined');
}