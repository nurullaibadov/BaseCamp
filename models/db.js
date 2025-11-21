// models/db.js
const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite veritabanı (dosya projenin kökünde oluşacak)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'), // kök dizinde olsun
  logging: false, // konsola sql log basmasın (istersen true yap)
});

// Modelleri yükle
const User = require('./User')(sequelize);
const Project = require('./Project')(sequelize);

// İlişkileri kur (çok önemli!)
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Project, { as: 'projects', foreignKey: 'ownerId' });

// İlk kullanıcı admin olsun (opsiyonel ama güzel)
const initializeAdmin = async () => {
  const userCount = await User.count();
  if (userCount === 0) {
    console.log('İlk kullanıcı oluşturuluyor... (otomatik ADMIN)');
    await User.create({
      username: 'admin',
      password: '123456', // ilk girişte değiştirsin
      isAdmin: true
    });
    console.log('Admin kullanıcı oluşturuldu → username: admin / password: 123456');
  }
};

// Veritabanını senkronize et + admin kontrol
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite bağlantısı başarılı!');

    await sequelize.sync({ alter: true }); // tabloları günceller, force: true yapma!
    console.log('Tablolar senkronize edildi.');

    await initializeAdmin(); // ilk admin kontrolü
  } catch (err) {
    console.error('Veritabanı hatası:', err);
  }
};

module.exports = {
  sequelize,
  connectDB,
  User,
  Project
};