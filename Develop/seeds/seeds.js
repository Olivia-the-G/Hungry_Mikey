const sequelize = require('../config/connection');
const User = require('../models/User');
const Activity = require('../models/Activity');
const userData = require('./userData.json');
const activityData = require('./userData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  
  for (const activity of activityData) {
    await Activity.create({
      ...activity,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }
  process.exit(0);
};

seedDatabase();
