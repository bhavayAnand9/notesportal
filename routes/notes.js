'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const notesController = require('../controllers/notesController');
const isAuth = require('../middleware/is-auth');

// /notes/get-notes => GET
router.get('/get-all-notes',isAuth, notesController.getAllNotes);


// /notes/submit-notes => POST
router.post('/submit-notes', isAuth, notesController.submitNotes)

router.get('/get-notes/:noteId',  notesController.getNote);

exports.routes = router;