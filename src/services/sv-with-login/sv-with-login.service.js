// Initializes the `sv_withLogin` service on path `/sv-with-login`
const { SvWithLogin } = require('./sv-with-login.class');
const createModel = require('../../models/sv-with-login.model');
const hooks = require('./sv-with-login.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/sv-with-login', new SvWithLogin(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sv-with-login');

  service.hooks(hooks);
};
