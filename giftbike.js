// Version 15
// Функция для проверки и установки firstVisit в localStorage
function setFirstVisit() {
  localStorage.setItem('firstVisit', 'true');
}

function isFirstVisit() {
  const firstVisit = localStorage.getItem('firstVisit');
  console.log('isFirstVisit check, firstVisit:', firstVisit);
  return !firstVisit;
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
  setFirstVisit();
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
    <p>Version: 15</p>
    <div style="margin-top: 10px;">
      <button onclick="changeLanguage('en')">ENGLISH</button>
      <button onclick="changeLanguage('ru')">РУССКИЙ</button>
      <button onclick="changeLanguage('lv')">LATVISKI</button>
    </div>
    <button style="margin-top: 10px;" onclick="this.parentElement.remove(); setFirstVisit(); console.log('Close clicked');">Close</button>
  `;
  document.body.appendChild(modal);
}

// Инициализация окна
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded triggered, page:', window.location.href);
  try {
    if (isFirstVisit()) {
      console.log('First visit detected, showing modal');
      setTimeout(() => {
        showModal();
      }, 1000); // Задержка 1 секунда
    } else {
      console.log('Not first visit, skipping modal');
    }
  } catch (error) {
    console.error('Error in DOMContentLoaded:', error);
  }
});