require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const oauthSetup = require('./auth');

const app = express();
app.use(bodyParser.json());

const MONGO = process.env.MONGO_URI || 'mongodb://mongo:27017/confessly';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-secret';
let db;

MongoClient.connect(MONGO, { useUnifiedTopology: true }).then(client=>{
  db = client.db('confessly');
  console.log('Mongo connected');
}).catch(err=>{console.error(err); process.exit(1);});

// session & passport (for OAuth admin)
app.use(session({
  secret: process.env.SESSION_SECRET || 'sess-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
oauthSetup(passport);

// helper
function hashToken(t){ return crypto.createHash('sha256').update(t).digest('hex'); }

app.get('/api/confessions', async (req,res)=>{
  const confs = await db.collection('confs').find({}, { projection: { message:1, createdAt:1 } }).sort({ createdAt:-1 }).limit(100).toArray();
  res.json(confs);
});

app.post('/api/confess', async (req,res)=>{
  const { message, uid_token } = req.body;
  if(!message) return res.status(400).json({ error: 'Message required' });
  let ownerId = null, tokenHash = null;
  if(uid_token){
    try{
      const decoded = jwt.verify(uid_token, JWT_SECRET);
      ownerId = decoded.sub;
      tokenHash = hashToken(uid_token);
    }catch(e){}
  }
  const doc = { message, createdAt: new Date(), ownerId, tokenHash };
  await db.collection('confs').insertOne(doc);
  res.json({ ok:true });
});

// simple admin check
function requireAdmin(req,res,next){
  if(req.isAuthenticated() && req.user && req.user.email){
    // check admins collection
    db.collection('admins').findOne({ email: req.user.email }).then(found=>{
      if(found) return next();
      return res.status(403).json({ error: 'admin only' });
    }).catch(err=>res.status(500).json({ error: 'db error' }));
  } else {
    res.status(401).json({ error: 'unauthenticated' });
  }
}

app.get('/api/admin/confessions', requireAdmin, async (req,res)=>{
  const confs = await db.collection('confs').find({}).sort({ createdAt:-1 }).toArray();
  res.json(confs);
});

app.post('/api/admin/generate-link', requireAdmin, async (req,res)=>{
  const { userId, expiresIn } = req.body;
  if(!userId) return res.status(400).json({ error: 'userId required' });
  const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: expiresIn || '30d' });
  await db.collection('links').insertOne({ userId, tokenHash: hashToken(token), createdAt: new Date() });
  res.json({ token, url: `/confess?uid_token=${token}` });
});

// OAuth routes (auth.js will setup the routes)
const oauth = require('./routes/oauth');
app.use('/auth', oauth);

// serve static frontend build if present
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
app.get('*', (req,res)=>{ res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html')); });

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Server listening on', PORT));
