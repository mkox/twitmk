// Initializes the `sv_twitter7` service on path `/sv-twitter-7`
const { SvTwitter7 } = require('./sv_twitter7.class');
const createModel = require('../../models/sv_twitter7.model');
const hooks = require('./sv_twitter7.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sv-twitter-7', new SvTwitter7(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sv-twitter-7');

  service.hooks(hooks);
};
