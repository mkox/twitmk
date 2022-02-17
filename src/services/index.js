const users = require('./users/users.service.js');
const followed = require('./followed/followed.service.js');
const tfollow = require('./tfollow/tfollow.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(followed);
  app.configure(tfollow);
};
