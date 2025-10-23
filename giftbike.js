document.addEventListener('DOMContentLoaded', function() {
    console.log('Ecwid title cleaner script loaded');

    // Функция для очистки меток из названий товаров
    function cleanProductTitles() {
        // Поиск всех элементов, которые могут содержать названия товаров
        var titleSelectors = [
            '.grid-product__title-inner', // Для страниц категорий/товаров
            '.ins-tile__product-name',    // Для виджета на главной странице
            '.ec-product__title',         // Дополнительный селектор для других возможных элементов
            '.ecwid-productBrowser-ProductPage-title' // Для страниц товаров
        ];

        titleSelectors.forEach(function(selector) {
            var titles = document.querySelectorAll(selector);
            titles.forEach(function(title) {
                var originalText = title.textContent;
                var cleanedText = originalText.replace(/\(RU\)|\(LV\)/gi, '').trim();
                if (cleanedText !== originalText) {
                    title.textContent = cleanedText;
                    console.log(`Cleaned title: ${originalText} -> ${cleanedText}`);
                }
            });
        });
    }

    // Выполняем очистку сразу
    cleanProductTitles();

    // Повторяем очистку при динамической загрузке страниц
    Ecwid.OnPageLoaded.add(function(page) {
        console.log('Ecwid page loaded:', page.type);
        if (page.type === 'CATEGORY' || page.type === 'PRODUCT' || page.type === 'INDEX') {
            cleanProductTitles();
        }
    });

    // Дополнительная проверка через setInterval для асинхронной загрузки
    var interval = setInterval(function() {
        var titles = document.querySelectorAll('.grid-product__title-inner, .ins-tile__product-name, .ec-product__title, .ecwid-productBrowser-ProductPage-title');
        if (titles.length > 0) {
            cleanProductTitles();
            console.log('Titles cleaned via interval');
        }
    }, 1000);

    // Останавливаем interval через 10 секунд, чтобы избежать лишней нагрузки
    setTimeout(function() {
        clearInterval(interval);
        console.log('Interval stopped');
    }, 10000);
});