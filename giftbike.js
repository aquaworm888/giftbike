// Version 14
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
    <p>Welcome! Please choose your language</p>
    <p>Version: 14</p>
    <div style="margin-top: 10px;">
      <button onclick="changeLanguage('en')">ENGLISH</button>
      <button onclick="changeLanguage('ru')">РУССКИЙ</button>
      <button onclick="changeLanguage('lv')">LATVISKI</button>
    </div>
    <button style="margin-top: 10px;" onclick="this.parentElement.remove(); setCookie('firstVisit', 'true', 365); console.log('Close clicked');">Close</button>
  `;
  document.body.appendChild(modal);
}

// Инициализация окна
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded triggered, page:', window.location.href);
  const isFirstVisit = !getCookie('firstVisit');
  if (isFirstVisit) {
    showModal();
  } else {
    console.log('Not first visit, skipping modal');
  }
});