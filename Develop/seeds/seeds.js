const sequelize = require('../config/connection');
const User = require('../models/User');
const Session = require('../models/Session');
const userData = require('./userData.json');
const sessionData = require('./userData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  
  for (const session of sessionData) {
    await Session.create({
      ...session,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }
  process.exit(0);
};

seedDatabase();
