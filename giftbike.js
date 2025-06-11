// Проверяем, что мы в контексте Ecwid
if (typeof Ecwid !== 'undefined') {
  // Хук на загрузку страницы
  Ecwid.OnPageLoaded.add(function(page) {
    // Создаем модальное окно
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
      <p>Hello!</p>
      <button onclick="this.parentElement.remove();">Close</button>
    `;
    document.body.appendChild(modal);
  });
}