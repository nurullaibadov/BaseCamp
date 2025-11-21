







require('dotenv').config();
const express = require('express');
const path = require('path');                    // BU SATIR OLSUN!

// BU 2 SATIR KESİNLİKLE OLSUN – EN ÜSTTE!
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

console.log('Views klasörü yolu:', path.join(__dirname, 'views')); // TEST İÇİN!







require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const methodOverride = require('method-override');
const path = require('path');                    // EKLENDİ!
const sequelize = require('./config/database');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

const app = express();

// SESSION
app.use(session({
  secret: process.env.SESSION_SECRET || 'gizlianahtar123',
  store: new SequelizeStore({ db: sequelize }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 gün
}));

// CRITICAL: BU SATIRI UNUTMUŞTUN! (HATA BURADAYDI)
app.set('views', path.join(__dirname, 'views'));  // VIEWS KLASÖRÜNÜ GÖSTER!
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Global template değişkenleri (layout.ejs'de kullanılıyor)
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.username = req.session.username || null;
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

// ROUTES
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);

// Ana sayfa
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/projects');
  } else {
    res.redirect('/auth/login');
  }
});

// 404 için (isteğe bağlı ama güzel olur)
app.use((req, res) => {
  res.status(404).send('<h1>404 - Sayfa Bulunamadı</h1><a href="/">Ana sayfa</a>');
});

// SUNUCUYU BAŞLAT
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }) // force: true yaparsan her seferinde tablo silinir
  .then(() => {
    console.log('DATABASE BAĞLANDI!');
    app.listen(PORT, () => {
      console.log(`SUNUCU ÇALIŞIYOR → http://localhost:${PORT}`);
      console.log(`Kayıt için: http://localhost:${PORT}/auth/register`);
    });
  })
  .catch(err => {
    console.error('Database bağlantı hatası:', err);
  });