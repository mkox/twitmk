// Initializes the `followed` service on path `/followed`
const { Followed } = require('./followed.class');
const createModel = require('../../models/followed.model');
const hooks = require('./followed.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/followed', new Followed(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('followed');

  service.hooks(hooks);
};
