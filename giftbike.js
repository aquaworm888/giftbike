// Проверяем, что мы в контексте Ecwid
if (typeof Ecwid !== 'undefined') {
  // Функция для отображения модального окна
  function showLanguageModal(storeLang, browserLang) {
    // Проверяем, не было ли окно уже показано
    if (localStorage.getItem('languageModalShown')) {
      return;
    }

    // Создаем HTML для модального окна
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
      <h3>Language Information</h3>
      <p>Store Language: ${storeLang}</p>
      <p>Browser Language: ${browserLang}</p>
      <button onclick="this.parentElement.remove(); localStorage.setItem('languageModalShown', 'true');">Close</button>
    `;
    document.body.appendChild(modal);
  }

  // Хук на загрузку страницы
  Ecwid.OnPageLoaded.add(function(page) {
    // Получаем язык магазина
    const storeLang = Ecwid.getStorefrontLang() || 'Unknown';
    // Получаем язык браузера
    const browserLang = navigator.language || navigator.languages[0] || 'Unknown';

    // Показываем модальное окно
    showLanguageModal(storeLang, browserLang);
  });
}