const express = require('express');
const app = express();
const fs = require('fs');
const axios = require('axios');
const xml2js = require('xml2js');
const path = require('path');
let rssFeedUrls = ['https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss'];

const rssUrl = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss';

async function parseRss() {
    try {
        const response = await axios.get(rssUrl);
        const xmlData = response.data;
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlData);
        const items = result.rss.channel[0].item;
        const articles = [];

        items.forEach((item) => {
            const mediaContent = item['media:content'] ? item['media:content'][0].$.url : null;
            const categories = item.category ? item.category.map(category => ({
                domain: category && category.$ && category.$.domain ? category.$.domain : null,
                content: category && category._ ? category._ : null
            })) : [];
            const article = {
                title: item.title[0] || 'No title',
                link: item.link[0] || 'Link not available',
                pubDate: item.pubDate[0] || 'Publication date is unknown',
                description: item.description[0] || 'No Description',
                sourceUrl: item.source[0].$.url || 'Source URL not available',
                categories: categories.length > 0 ? categories : [{ domain: null, content: 'No categories available' }],
                author: item.author[0]|| 'Author is unknown' ,
                mediaUrl: mediaContent || 'MediaUrl not available'
            };
            articles.push(article);
        });

        return articles;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Маршрут для отправки данных о новостях
app.get('/news', async (req, res) => {
    try {
        const articles = await parseRss();
        res.json(articles);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Настроим сервер для обслуживания статических файлов
app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));
app.use('/partial', express.static(path.join(__dirname, 'partial')));

app.get('/style.css', function(req, res) {
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'style.css'));
});



// Handle POST request to add RSS feed URL

const port = 5002;
app.listen(port, () => {
    console.log(`HTTP Listening on: http://localhost:${port}`);
});
