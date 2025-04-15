const express = require('express');
const https = require('https');
const fs = require('fs');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet'); // For HTTP headers security
const rateLimit = require('express-rate-limit'); // For rate limiting
require('dotenv').config();

const app = express();

// Use Helmet to secure HTTP headers
app.use(helmet());

// Configure rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Secure session middleware configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey', // Use a strong secret stored in .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevent client-side access to cookies
    secure: true, // Ensure cookies are sent only over HTTPS
    maxAge: 3600000, // Session expiry time (1 hour)
  },
}));

// Initialize Passport and enable session support
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport OAuth Strategy for GitHub
passport.use(new OAuth2Strategy({
  authorizationURL: 'https://github.com/login/oauth/authorize',
  tokenURL: 'https://github.com/login/oauth/access_token',
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URI,
}, (accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id || 'unique-id',
    name: profile.displayName || 'GitHub User',
    accessToken,
  };
  return done(null, user);
}));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  const user = { id }; // Replace with database lookup if needed
  done(null, user);
});

// Routes for authentication
app.get('/auth', passport.authenticate('oauth2'));
app.get('/auth/callback', passport.authenticate('oauth2', {
  successRedirect: '/success',
  failureRedirect: '/failure',
}));

// Success and failure routes
app.get('/success', (req, res) => res.send('Authentication Successful!'));
app.get('/failure', (req, res) => res.send('Authentication Failed!'));

// Secure endpoint example (requires authentication)
app.get('/secure-data', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }
  res.send(`Secure data for user ${req.user.id}`);
});

// Read SSL certificate and key files
const options = {
  key: fs.readFileSync('./key.pem'), // Path to private key
  cert: fs.readFileSync('./cert.pem'), // Path to certificate
};

// Create HTTPS server with SSL certificates
https.createServer(options, app).listen(3000, () => {
  console.log('Secure server running on https://localhost:3000');
});
