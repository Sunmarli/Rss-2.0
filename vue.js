
document.addEventListener('DOMContentLoaded', function() {
    loadNews();
        });

// Функция для загрузки новостей
function loadNews() {
    // Создаем XMLHttpRequest объект для отправки запроса на сервер
    var xhr = new XMLHttpRequest();

    // Открываем запрос на сервер для получения данных о новостях
    xhr.open("GET", "/news", true);

    // Устанавливаем обработчик события "load", который сработает при успешном получении ответа от сервера
    xhr.onload = function () {
        // Проверяем статус ответа
        if (xhr.status == 200) {
            // Получаем данные о новостях из ответа сервера
            var newsData = JSON.parse(xhr.responseText);

            // Вызываем функцию для отображения новостей на странице
            displayNews(newsData);
        } else {
            // Если возникла ошибка, выводим сообщение об ошибке
            console.error("Ошибка загрузки новостей: " + xhr.statusText);
        }
    };

    // Устанавливаем обработчик события "error", который сработает при ошибке запроса
    xhr.onerror = function () {
        console.error("Произошла ошибка при отправке запроса на сервер");
    };

    // Отправляем запрос на сервер
    xhr.send();
}

function formatPubDate(pubDate) {
    // Parse the pubDate string into a Date object
    const date = new Date(pubDate);

    // Create an array of month names
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Get the day of the week, day of the month, and month
    const dayOfWeek = date.toLocaleDateString('en', { weekday: 'short' });
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];

    // Return the formatted date string
    return `${dayOfWeek}, ${dayOfMonth} ${month}`;
}

// Функция для отображения новостей на странице
function displayNews(newsData) {
    // Получаем контейнер для новостей
    var articlesContainer = document.getElementById("articles");

    // Очищаем контейнер от предыдущих новостей
    articlesContainer.innerHTML = "";

    // Перебираем полученные данные о новостях и добавляем каждую новость на страницу
    newsData.forEach(function (newsItem) {
        // Создаем элементы для отображения новости
        var newsElement = document.createElement("div");
        newsElement.classList.add("news-item");

        // Conditional logic to add mediaUrl to description
            // if (newsItem.mediaUrl !== 'MediaUrl not available') {
            //     newsItem.description = 
            //     `<a href=${newsItem.link} ><img src=${newsItem.mediaUrl} class="news-image" ></a>` + newsItem.description;
            // }

            // Conditional logic to add mediaUrl to description
                var imageHTML = '';
                var descriptionHTML = '';

                if (newsItem.mediaUrl !== 'MediaUrl not available') {
                    imageHTML = `<a href=${newsItem.link}><img src=${newsItem.mediaUrl} class="news-image"></a><a href=${newsItem.link}><h2>${newsItem.title}</h2></a>`;
                } else {
                    descriptionHTML = `<div class="description"> <a href=${newsItem.link}><h2>${newsItem.title}</h2></a><p>${newsItem.description}</p></div>`;
                }

                // Заполняем элементы данными о новости
                newsElement.innerHTML = `
                    ${imageHTML}
                    ${descriptionHTML}
                    <div class="author">
                        <p>${newsItem.author} - <span>${formatPubDate(newsItem.pubDate)}</span></p>
                    </div>
                   
                `;

    
        articlesContainer.appendChild(newsElement);
    });
}
const app = Vue.createApp({
    data() {
        return {
            newsItems: [],
            categories: [],
            selectedCategory: '',
            filteredNewsItems: [],
        };
    },
    mounted() {
        this.loadNews();
    },
    methods: {
        formatPubDate(pubDate) {
            const date = new Date(pubDate);
            const dayOfWeek = date.toLocaleDateString('en', { weekday: 'short' });
            const dayOfMonth = date.getDate();
            const month = date.toLocaleDateString('en', { month: 'short' });
            return `${dayOfWeek}, ${dayOfMonth} ${month}`;
        },
        async loadNews() {
            try {
                const response = await fetch("/news");
                if (!response.ok) {
                    throw new Error("Failed to fetch news");
                }
                const newsData = await response.json();
                this.newsItems = newsData;

                // Extract unique categories from news items
                this.categories = [...new Set(newsData.flatMap(item => item.categories.map(category => category.content)))];

                // Initially, set filteredNewsItems to all news items
                this.filteredNewsItems = [...this.newsItems];
            } catch (error) {
                console.error("Error:", error);
            }
        },
        filterNews() {
            if (this.selectedCategory === '') {
                // If no category selected, show all news items
                this.filteredNewsItems = [...this.newsItems];
            } else {
                // Filter news items based on selected category
                this.filteredNewsItems = this.newsItems.filter(item => item.categories.some(category => category.content === this.selectedCategory));
            }
        }
    },
});

app.mount("#app");
