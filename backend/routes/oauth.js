const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req,res)=>{
  // after successful login, redirect to admin UI
  res.redirect('/?admin=1');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req,res)=>{
  res.redirect('/?admin=1');
});

module.exports = router;
