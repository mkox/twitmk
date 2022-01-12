const users = require('./users/users.service.js');
const svTwitter1 = require('./sv_twitter1/sv_twitter1.service.js');
const svTwitter2 = require('./sv_twitter2/sv_twitter2.service.js');
const followed = require('./followed/followed.service.js');
const svTwitter3 = require('./sv_twitter3/sv_twitter3.service.js');
const svTwitter4 = require('./sv_twitter4/sv_twitter4.service.js');
const svTwitter5 = require('./sv_twitter5/sv_twitter5.service.js');
const svWithLogin = require('./sv-with-login/sv-with-login.service.js');
const svTwitter6 = require('./sv_twitter6/sv_twitter6.service.js');
const svabcd = require('./svabcd/svabcd.service.js');
const svTwitter7 = require('./sv_twitter7/sv_twitter7.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  //app.configure(svTwitter1);
  app.configure(svTwitter2);
  app.configure(followed);
  //app.configure(svTwitter3);
  //app.configure(svTwitter4);
  //app.configure(svTwitter5);
  app.configure(svWithLogin);
  //app.configure(svTwitter6);
  app.configure(svabcd);
  app.configure(svTwitter7);
};
