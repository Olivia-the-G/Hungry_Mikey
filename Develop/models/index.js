const User = require('./User');
const Activity = require('./Activity');

User.hasMany(Activity, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });

Activity.belongsTo(User, {
    foreignKey: 'user_id'
  });

module.exports = { User, Activity };