// Initializes the `svabcd` service on path `/svabcd`
const { Svabcd } = require('./svabcd.class');
const createModel = require('../../models/svabcd.model');
const hooks = require('./svabcd.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/svabcd', new Svabcd(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('svabcd');

  service.hooks(hooks);
};
