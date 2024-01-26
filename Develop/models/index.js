const User = require('./User');
const Session = require('./Session');

User.hasMany(Session, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
  });

Session.belongsTo(User, {
    foreignKey: 'user_id'
  });

module.exports = { User, Session };