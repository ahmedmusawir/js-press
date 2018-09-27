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
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// POST STORY
router.post('/', ensureAuthenticated, (req, res) => {
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
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id,
  }).then((story) => {
    res.render('stories/edit', {
      story,
    });
  });
});
// EDIT PUT REQUEST
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id,
  }).then((story) => {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save().then((story) => {
      res.redirect('/dashboard');
    });
  });
});
// STORIES SHOW LIST
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id,
  })
    .populate('user')
    .then((story) => {
      res.render('stories/show', {
        story,
      });
    });
});
// DELETE STORY
router.delete('/:id', (req, res) => {
  Story.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect('/dashboard');
  });
});
module.exports = router;
