document.addEventListener('DOMContentLoaded', function() {
    // Функция для очистки меток из названий товаров
    function cleanProductTitles() {
        // Очистка названий на страницах категорий/товаров
        var productTitles = document.querySelectorAll('.grid-product__title-inner');
        productTitles.forEach(function(title) {
            var originalText = title.textContent;
            var cleanedText = originalText.replace(/\(RU\)|\(LV\)/gi, '').trim();
            if (cleanedText !== originalText) {
                title.textContent = cleanedText;
            }
        });

        // Очистка названий в виджете на главной странице
        var widgetTitles = document.querySelectorAll('.ins-tile__product-name');
        widgetTitles.forEach(function(title) {
            var originalText = title.textContent;
            var cleanedText = originalText.replace(/\(RU\)|\(LV\)/gi, '').trim();
            if (cleanedText !== originalText) {
                title.textContent = cleanedText;
            }
        });
    }

    // Выполняем очистку при загрузке страницы
    cleanProductTitles();

    // Повторяем очистку при динамической загрузке страниц
    Ecwid.OnPageLoaded.add(function(page) {
        if (page.type === 'CATEGORY' || page.type === 'PRODUCT' || page.type === 'INDEX') {
            cleanProductTitles();
        }
    });
});