const fs = require('fs').promises;
const path = require('path');

const songsFilePath = path.join(__dirname, '../data/songs.json');

// Чтение песен из файла
const readSongs = async () => {
  try {
    const data = await fs.readFile(songsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения файла:', error);
    return [];
  }
};

// Запись песен в файл
const writeSongs = async (songs) => {
  try {
    await fs.writeFile(songsFilePath, JSON.stringify(songs, null, 2), 'utf8');
  } catch (error) {
    console.error('Ошибка записи в файл:', error);
  }
};

// Получить все песни
const getAllSongs = async (req, res) => {
  try {
    const { artist, genre, year } = req.query;
    let songs = await readSongs();
    
    // Фильтрация по query-параметрам
    if (artist) {
      songs = songs.filter(song => 
        song.artist.toLowerCase().includes(artist.toLowerCase())
      );
    }
    
    if (genre) {
      songs = songs.filter(song => 
        song.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }
    
    if (year) {
      songs = songs.filter(song => song.year.toString() === year);
    }
    
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении песен' });
  }
};

// Получить песню по ID
const getSongById = async (req, res) => {
  try {
    const songs = await readSongs();
    const song = songs.find(s => s.id === parseInt(req.params.id));
    
    if (!song) {
      return res.status(404).json({ error: 'Песня не найдена' });
    }
    
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении песни' });
  }
};

// Добавить новую песню
const addSong = async (req, res) => {
  try {
    const { title, artist, album, year, genre, duration } = req.body;
    
    if (!title || !artist) {
      return res.status(400).json({ error: 'Название и исполнитель обязательны' });
    }
    
    const songs = await readSongs();
    
    // Генерация нового ID
    const newId = songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1;
    
    const newSong = {
      id: newId,
      title,
      artist,
      album: album || '',
      year: year || new Date().getFullYear(),
      genre: genre || 'Unknown',
      duration: duration || '0:00'
    };
    
    songs.push(newSong);
    await writeSongs(songs);
    
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении песни' });
  }
};

// Обновить песню
const updateSong = async (req, res) => {
  try {
    const songs = await readSongs();
    const songIndex = songs.findIndex(s => s.id === parseInt(req.params.id));
    
    if (songIndex === -1) {
      return res.status(404).json({ error: 'Песня не найдена' });
    }
    
    const updatedSong = {
      ...songs[songIndex],
      ...req.body,
      id: songs[songIndex].id // ID не изменяем
    };
    
    songs[songIndex] = updatedSong;
    await writeSongs(songs);
    
    res.json(updatedSong);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении песни' });
  }
};

// Удалить песню
const deleteSong = async (req, res) => {
  try {
    const songs = await readSongs();
    const songIndex = songs.findIndex(s => s.id === parseInt(req.params.id));
    
    if (songIndex === -1) {
      return res.status(404).json({ error: 'Песня не найдена' });
    }
    
    const deletedSong = songs.splice(songIndex, 1)[0];
    await writeSongs(songs);
    
    res.json({ message: 'Песня удалена', song: deletedSong });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении песни' });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  addSong,
  updateSong,
  deleteSong
};