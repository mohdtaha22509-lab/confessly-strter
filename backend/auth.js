// Minimal Passport OAuth setup (Google & GitHub)
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

module.exports = function(passport){
  passport.serializeUser(function(user, done){ done(null, user); });
  passport.deserializeUser(function(obj, done){ done(null, obj); });

  if(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET){
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: (process.env.BASE_URL || 'http://localhost:4000') + '/auth/google/callback'
    }, function(accessToken, refreshToken, profile, done){
      // profile.emails[0].value is commonly available
      done(null, { provider: 'google', id: profile.id, email: (profile.emails && profile.emails[0] && profile.emails[0].value) || null, name: profile.displayName });
    }));
  }

  if(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET){
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: (process.env.BASE_URL || 'http://localhost:4000') + '/auth/github/callback'
    }, function(accessToken, refreshToken, profile, done){
      done(null, { provider: 'github', id: profile.id, email: (profile.emails && profile.emails[0] && profile.emails[0].value) || null, name: profile.displayName });
    }));
  }
};
