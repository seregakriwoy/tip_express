const express = require('express');
const path = require('path');
const songsRoutes = require('./routes/songsRoutes');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для обработки JSON и URL-encoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware для логирования
app.use(logger);

// Раздача статических файлов из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Подключение маршрутов
app.use('/api/songs', songsRoutes);

// Основной маршрут
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Доступно по адресу: http://localhost:${PORT}`);
});