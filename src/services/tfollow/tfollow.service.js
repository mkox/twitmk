// Initializes the `tfollow` service on path `/tfollow`
const { Tfollow } = require('./tfollow.class');
const createModel = require('../../models/tfollow.model');
const hooks = require('./tfollow.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    //paginate: app.get('paginate')
    //paginate: {
    //default: 20,
    //max: 50
    //},
    whitelist: ['$eq','$gte','$lte','$text']
  };

  // Initialize our service with any options it requires
  app.use('/tfollow', new Tfollow(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tfollow');

  service.hooks(hooks);
};
