const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const User = mongoose.model('users');
const Story = mongoose.model('stories');

// STORIES INDEX
router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .then((stories) => {
      res.render('stories/index', {
        stories,
      });
    });
});
// STORIES ADD FORM
// router.get('/add', ensureAuthenticated, (req, res) => {
//   res.render('stories/add');
// });
router.get('/add', (req, res) => {
  res.render('stories/add');
});
// POST STORY
router.post('/', (req, res) => {
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    user: req.user.id,
  };
  // Create Story
  new Story(newStory).save().then((story) => {
    res.redirect(`/stories/show/${story.id}`);
  });
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
