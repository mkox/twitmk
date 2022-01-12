// Initializes the `sv_twitter6` service on path `/sv-twitter-6`
const { SvTwitter6 } = require('./sv_twitter6.class');
const createModel = require('../../models/sv_twitter6.model');
const hooks = require('./sv_twitter6.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sv-twitter-6', new SvTwitter6(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sv-twitter-6');

  service.hooks(hooks);
};
