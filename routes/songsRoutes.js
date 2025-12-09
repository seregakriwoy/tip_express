const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');

// Маршруты для песен
router.get('/', songsController.getAllSongs); // GET /api/songs
router.get('/:id', songsController.getSongById); // GET /api/songs/:id
router.post('/', songsController.addSong); // POST /api/songs
router.put('/:id', songsController.updateSong); // PUT /api/songs/:id
router.delete('/:id', songsController.deleteSong); // DELETE /api/songs/:id

module.exports = router;