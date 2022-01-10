const assert = require('assert');
const app = require('../../src/app');

describe('\'sv_withLogin\' service', () => {
  it('registered the service', () => {
    const service = app.service('sv-with-login');

    assert.ok(service, 'Registered the service');
  });
});
