const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
//installation Helmet
const helmet = require('helmet');
// installation Cors 
// TODO verifier comment configurer cors
const cors = require('cors');
// limiter les requêtes
const rateLimit = require('express-rate-limit');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require("./routes/user");

mongoose.connect('mongodb+srv://Lea:LeaP6Backend@cluster0.og9dv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // limite chaque IP à 100 requêtes par window de 15min
    standardHeaders: true, // retourne l'info de limite dans les headers
    legacyHeaders: false // désactive le 'X-rateLimit-*' headers
});

// appel de la méthode express
const app = express();
app.use(helmet());
app.use(cors());
app.use(limiter);

// Prévention des erreurs CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

module.exports = app;