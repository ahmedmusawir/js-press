const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

// STORIES INDEX
router.get('/', (req, res) => {
  res.render('stories/index');
});
// STORIES ADD FORM
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});
// STORIES EDIT FORM
router.get('/edit', ensureAuthenticated, (req, res) => {
  res.render('stories/edit');
});
// STORIES SHOW LIST
router.get('/show', ensureAuthenticated, (req, res) => {
  res.render('stories/show');
});

module.exports = router;
